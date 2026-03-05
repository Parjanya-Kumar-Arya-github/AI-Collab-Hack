import dotenv from 'dotenv';
dotenv.config();

const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';
const MODEL = process.env.MISTRAL_MODEL || 'mistral-small-latest';

// ─── ELO calculation from scores ─────────────────────────────────────────────
const calculateElo = (skillScores, experienceBonus, completionBonus) => {
  const scores = Object.values(skillScores);
  if (!scores.length) return 0;
  const avgSkill = scores.reduce((a, b) => a + b, 0) / scores.length;
  // Scale: avg skill (0-100) → ELO (0-5000)
  // Base: avgSkill * 35 + experienceBonus (0-500) + completionBonus (0-200)
  const raw = Math.round(avgSkill * 35 + experienceBonus + completionBonus);
  return Math.min(5000, Math.max(0, raw));
};

// ─── Tier from ELO ───────────────────────────────────────────────────────────
export const getTier = (elo) => {
  if (elo >= 4000) return 'Elite';
  if (elo >= 3000) return 'Expert';
  if (elo >= 2000) return 'Hacker';
  if (elo >= 1000) return 'Builder';
  if (elo > 0)     return 'Explorer';
  return 'Unrated';
};

// ─── Main assessment function ─────────────────────────────────────────────────
export const runSkillAssessment = async (assessmentData) => {
  const {
    claimed_skills,
    github_username,
    linkedin_url,
    kaggle_url,
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
  } = assessmentData;

  const prompt = `You are an expert technical recruiter and skill assessor for a hackathon/competition platform. Your job is to evaluate a user's profile and assign a fair initial skill rating.

Analyze the following user profile data and return a JSON assessment:

## CLAIMED SKILLS
${JSON.stringify(claimed_skills, null, 2)}

## EXTERNAL PROFILES
- GitHub: ${github_username || 'Not provided'}
- LinkedIn: ${linkedin_url || 'Not provided'}
- Kaggle: ${kaggle_url || 'Not provided'}

## CERTIFICATES
${certificates?.length ? JSON.stringify(certificates, null, 2) : 'None provided'}

## PAST COMPETITIONS
${past_competitions?.length ? JSON.stringify(past_competitions, null, 2) : 'None provided'}

## FEATURED PROJECT
Title: ${project_title || 'Not provided'}
Description: ${project_description || 'Not provided'}
Role: ${project_role || 'Not provided'}
Outcome: ${project_outcome || 'Not provided'}
Link: ${project_link || 'Not provided'}

## WRITTEN RESPONSES
Strongest Project: ${written_strongest_project || 'Not provided'}
Team Role: ${written_team_role || 'Not provided'}
Biggest Achievement: ${written_achievement || 'Not provided'}

## PREFERENCES
Hours/week available: ${hours_per_week || 'Not specified'}
Preferred role: ${preferred_role || 'Not specified'}
Competition types: ${preferred_comp_types?.join(', ') || 'Not specified'}

---

Based on this data, provide a JSON response with this EXACT structure (no markdown, no explanation, just raw JSON):

{
  "verified_skills": [
    {"skill": "React", "claimed_level": "advanced", "verified_level": "intermediate", "confidence": 75, "verified": true},
    ...
  ],
  "skill_scores": {
    "Frontend": 65,
    "Backend": 40,
    "AI/ML": 0,
    "Design": 20,
    "DevOps": 10,
    "Data": 0,
    "Business": 0,
    "Web3": 0
  },
  "experience_bonus": 150,
  "completion_bonus": 100,
  "confidence": "medium",
  "reasoning": "2-3 sentence explanation of the rating"
}

Rules:
- skill_scores are 0-100 per domain. Only score domains the user has evidence for.
- experience_bonus: 0-500 based on competition history and work experience
- completion_bonus: 0-200 based on profile completeness and verifiability
- confidence: "low" if mostly self-reported, "medium" if some verification, "high" if strong external evidence
- Be fair but skeptical of unverified claims. Cross-check project descriptions against claimed skills.
- If GitHub is provided, assume moderate technical verification even without API access.
- Return ONLY the JSON object, nothing else.`;

  const response = await fetch(MISTRAL_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,   // low temp for consistent structured output
      max_tokens: 1500,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Mistral API error: ${err}`);
  }

  const data = await response.json();
  const rawText = data.choices[0].message.content.trim();

  // Parse JSON — strip markdown fences if model added them
  const cleaned = rawText.replace(/```json|```/g, '').trim();
  const result = JSON.parse(cleaned);

  // Calculate final ELO from AI scores
  const elo = calculateElo(
    result.skill_scores,
    result.experience_bonus || 0,
    result.completion_bonus || 0
  );

  return {
    verified_skills:  result.verified_skills  || [],
    skill_scores:     result.skill_scores     || {},
    ai_confidence:    result.confidence       || 'low',
    ai_reasoning:     result.reasoning        || '',
    ai_raw_response:  rawText,
    initial_elo:      elo,
    tier:             getTier(elo),
  };
};