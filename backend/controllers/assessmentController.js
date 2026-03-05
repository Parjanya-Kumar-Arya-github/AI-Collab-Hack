import pool from '../config/db.js';
import { runSkillAssessment, getTier } from '../utils/mistralService.js';

// ─── GET ASSESSMENT STATUS ────────────────────────────────────────────────────
export const getAssessmentStatus = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, status, submitted_at, completed_at, ai_tier, ai_initial_elo, ai_reasoning, ai_confidence FROM user_assessments WHERE user_id = $1',
      [req.user.id]
    );

    if (!result.rows.length) {
      return res.json({ success: true, status: 'not_started' });
    }

    res.json({ success: true, assessment: result.rows[0] });
  } catch (err) {
    console.error('getAssessmentStatus error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── SUBMIT ASSESSMENT ────────────────────────────────────────────────────────
export const submitAssessment = async (req, res) => {
  try {
    // Check not already done
    const existing = await pool.query(
      "SELECT id, status FROM user_assessments WHERE user_id = $1",
      [req.user.id]
    );

    if (existing.rows.length > 0 && existing.rows[0].status === 'completed') {
      return res.status(409).json({
        success: false,
        message: 'Assessment already completed. You can only do this once.',
      });
    }

    const {
      claimed_skills,
      github_username,
      linkedin_url,
      kaggle_url,
      other_profile_url,
      certificates,
      past_competitions,
      project_title,
      project_description,
      project_role,
      project_outcome,
      project_link,
      written_strongest_project,
      written_team_role,
      written_achievement,
      hours_per_week,
      preferred_role,
      preferred_comp_types,
      location_preference,
    } = req.body;

    // Insert or update assessment row as 'processing'
    const assessmentResult = await pool.query(
      `INSERT INTO user_assessments (
        user_id, claimed_skills, github_username, linkedin_url, kaggle_url,
        other_profile_url, certificates, past_competitions,
        project_title, project_description, project_role, project_outcome, project_link,
        written_strongest_project, written_team_role, written_achievement,
        hours_per_week, preferred_role, preferred_comp_types, location_preference,
        status
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,'processing')
      ON CONFLICT (user_id) DO UPDATE SET
        claimed_skills = $2, github_username = $3, linkedin_url = $4,
        kaggle_url = $5, other_profile_url = $6, certificates = $7,
        past_competitions = $8, project_title = $9, project_description = $10,
        project_role = $11, project_outcome = $12, project_link = $13,
        written_strongest_project = $14, written_team_role = $15,
        written_achievement = $16, hours_per_week = $17, preferred_role = $18,
        preferred_comp_types = $19, location_preference = $20,
        status = 'processing', submitted_at = NOW()
      RETURNING id`,
      [
        req.user.id,
        JSON.stringify(claimed_skills || []),
        github_username || null,
        linkedin_url || null,
        kaggle_url || null,
        other_profile_url || null,
        JSON.stringify(certificates || []),
        JSON.stringify(past_competitions || []),
        project_title || null,
        project_description || null,
        project_role || null,
        project_outcome || null,
        project_link || null,
        written_strongest_project || null,
        written_team_role || null,
        written_achievement || null,
        hours_per_week || null,
        preferred_role || null,
        preferred_comp_types || [],
        location_preference || null,
      ]
    );

    // Also update github_username on user profile if provided
    if (github_username) {
      await pool.query(
        'UPDATE users SET github_username = $1 WHERE id = $2',
        [github_username, req.user.id]
      );
    }

    // Run AI assessment
    let aiResult;
    try {
      aiResult = await runSkillAssessment(req.body);
    } catch (aiErr) {
      console.error('AI assessment failed:', aiErr);
      // Mark as failed but don't crash
      await pool.query(
        "UPDATE user_assessments SET status = 'failed' WHERE user_id = $1",
        [req.user.id]
      );
      return res.status(500).json({
        success: false,
        message: 'AI assessment failed. Please try again.',
      });
    }

    // Save AI results to assessment
    await pool.query(
      `UPDATE user_assessments SET
        ai_verified_skills = $1,
        ai_skill_scores    = $2,
        ai_initial_elo     = $3,
        ai_tier            = $4,
        ai_confidence      = $5,
        ai_reasoning       = $6,
        ai_raw_response    = $7,
        status             = 'completed',
        completed_at       = NOW()
       WHERE user_id = $8`,
      [
        JSON.stringify(aiResult.verified_skills),
        JSON.stringify(aiResult.skill_scores),
        aiResult.initial_elo,
        aiResult.tier,
        aiResult.ai_confidence,
        aiResult.ai_reasoning,
        aiResult.ai_raw_response,
        req.user.id,
      ]
    );

    // Update user_ratings with AI result
    await pool.query(
      `UPDATE user_ratings SET
        elo_score         = $1,
        tier              = $2,
        rating_confidence = $3,
        updated_at        = NOW()
       WHERE user_id = $4`,
      [aiResult.initial_elo, aiResult.tier, aiResult.ai_confidence, req.user.id]
    );

    // Update skill domain scores
    const scores = aiResult.skill_scores;
    await pool.query(
      `UPDATE user_ratings SET
        technical_score  = $1,
        experience_score = $2
       WHERE user_id = $3`,
      [
        Math.round((scores.Frontend || 0 + scores.Backend || 0 + scores['AI/ML'] || 0) / 3),
        Math.round((scores.Business || 0 + scores.Data || 0) / 2),
        req.user.id,
      ]
    );

    // Mark user assessment as done
    await pool.query(
      'UPDATE users SET is_assessment_done = TRUE WHERE id = $1',
      [req.user.id]
    );

    // Sync verified skills to user_skills table
    if (aiResult.verified_skills?.length) {
      for (const vs of aiResult.verified_skills) {
        if (!vs.verified) continue;
        // Find skill by name
        const skillRow = await pool.query(
          'SELECT id FROM skills WHERE LOWER(name) = LOWER($1)',
          [vs.skill]
        );
        if (!skillRow.rows.length) continue;
        await pool.query(
          `INSERT INTO user_skills (user_id, skill_id, proficiency_level, is_verified, verification_source, verification_score)
           VALUES ($1, $2, $3, TRUE, 'ai_assessment', $4)
           ON CONFLICT (user_id, skill_id) DO UPDATE SET
             is_verified = TRUE, verification_source = 'ai_assessment', verification_score = $4`,
          [req.user.id, skillRow.rows[0].id, vs.verified_level || vs.claimed_level, vs.confidence || 70]
        );
      }
    }

    res.json({
      success: true,
      message: 'Assessment completed!',
      result: {
        elo_score:   aiResult.initial_elo,
        tier:        aiResult.tier,
        confidence:  aiResult.ai_confidence,
        reasoning:   aiResult.ai_reasoning,
        skill_scores: aiResult.skill_scores,
      },
    });
  } catch (err) {
    console.error('submitAssessment error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
