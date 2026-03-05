import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import pool from './db.js';

// ─── Generate a unique temporary username ─────────────────────────────────────
const generateTempUsername = async (base) => {
  const cleaned = (base || 'user').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12) || 'user';
  let attempts = 0;
  while (attempts < 10) {
    const suffix = attempts === 0 ? '' : Math.floor(Math.random() * 9000 + 1000);
    const username = `${cleaned}${suffix}`;
    const exists = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (exists.rows.length === 0) return username;
    attempts++;
  }
  return `user${Date.now().toString().slice(-8)}`;
};

// ─── Helper: find or create user from OAuth ──────────────────────────────────
const findOrCreateUser = async ({ provider, providerId, email, name, avatarUrl, githubUsername }) => {
  // Try find by oauth provider + id
  const existing = await pool.query(
    'SELECT * FROM users WHERE oauth_provider = $1 AND oauth_id = $2',
    [provider, providerId]
  );
  if (existing.rows.length > 0) return existing.rows[0];

  // Try find by email (same person, different OAuth provider)
  if (email) {
    const byEmail = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (byEmail.rows.length > 0) {
      await pool.query(
        'UPDATE users SET oauth_provider = $1, oauth_id = $2 WHERE id = $3',
        [provider, providerId, byEmail.rows[0].id]
      );
      return byEmail.rows[0];
    }
  }

  // Generate temp username from github handle, display name, or email prefix
  const usernameBase = githubUsername || name || email?.split('@')[0] || 'user';
  const tempUsername = await generateTempUsername(usernameBase);

  // Create new user
  const result = await pool.query(
    `INSERT INTO users (oauth_provider, oauth_id, email, full_name, avatar_url, github_username, username)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [provider, providerId, email || null, name || null, avatarUrl || null, githubUsername || null, tempUsername]
  );

  const newUser = result.rows[0];

  // Create empty ratings + preferences rows
  await pool.query('INSERT INTO user_ratings (user_id) VALUES ($1)', [newUser.id]);
  await pool.query('INSERT INTO user_preferences (user_id) VALUES ($1)', [newUser.id]);

  return newUser;
};

// ─── Google Strategy ─────────────────────────────────────────────────────────
passport.use(new GoogleStrategy(
  {
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  process.env.GOOGLE_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await findOrCreateUser({
        provider:   'google',
        providerId: profile.id,
        email:      profile.emails?.[0]?.value,
        name:       profile.displayName,
        avatarUrl:  profile.photos?.[0]?.value,
      });
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// ─── GitHub Strategy ─────────────────────────────────────────────────────────
passport.use(new GitHubStrategy(
  {
    clientID:     process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL:  process.env.GITHUB_CALLBACK_URL,
    scope:        ['user:email'],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await findOrCreateUser({
        provider:       'github',
        providerId:     profile.id,
        email:          profile.emails?.[0]?.value,
        name:           profile.displayName || profile.username,
        avatarUrl:      profile.photos?.[0]?.value,
        githubUsername: profile.username,
      });
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// Serialize/deserialize (only used briefly during OAuth handshake — we switch to JWT after)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0] || null);
  } catch (err) {
    done(err, null);
  }
});

export default passport;