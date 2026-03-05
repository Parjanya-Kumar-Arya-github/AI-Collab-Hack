import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

// Generate JWT from user row
export const generateToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

// Called after passport OAuth success — redirect to frontend with JWT
export const oauthSuccess = (req, res) => {
  const user    = req.user;
  const token   = generateToken(user);
  const isNewUser = !user.is_profile_complete;
  const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${token}&new=${isNewUser}`;
  res.redirect(redirectUrl);
};

// OAuth failure
export const oauthFailure = (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
};

// GET /api/auth/me — called by AuthContext on every page load to hydrate user
export const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        u.id, u.username, u.email, u.full_name, u.mobile_number, u.city,
        u.avatar_url, u.bio, u.headline, u.website_url, u.github_username,
        u.linkedin_url, u.oauth_provider, u.is_profile_complete, u.is_assessment_done,
        u.created_at,
        r.elo_score, r.tier, r.total_competitions, r.wins, r.podium_finishes
       FROM users u
       LEFT JOIN user_ratings r ON r.user_id = u.id
       WHERE u.id = $1 AND u.is_active = true`,
      [req.user.id]
    );

    if (!result.rows.length)
      return res.status(404).json({ success: false, message: 'User not found.' });

    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error('getMe error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};