-- ============================================================
-- MIGRATION: Add Assessment Tables
-- ============================================================

-- Reset initial elo to 0 for all users (rating only after assessment)
UPDATE user_ratings SET
  elo_score        = 0,
  tier             = 'Unrated',
  rating_confidence = 'low'
WHERE elo_score = 800;

-- Update default for future users
ALTER TABLE user_ratings ALTER COLUMN elo_score SET DEFAULT 0;
ALTER TABLE user_ratings ALTER COLUMN tier SET DEFAULT 'Unrated';

-- ============================================================
-- ASSESSMENT SUBMISSIONS
-- Stores the full form data + AI result. One per user.
-- ============================================================
CREATE TABLE IF NOT EXISTS user_assessments (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Step 1: Skills (stored as JSON array of {skill_id, name, proficiency_level})
  claimed_skills    JSONB,

  -- Step 2: Linked profiles
  github_username   VARCHAR(100),
  linkedin_url      TEXT,
  kaggle_url        TEXT,
  other_profile_url TEXT,

  -- Step 3: Certificates (array of {title, issuer, issued_date, file_url})
  certificates      JSONB,

  -- Step 4: Past competitions (array of {name, organizer, year, role, placement})
  past_competitions JSONB,

  -- Step 5: Featured project
  project_title       VARCHAR(200),
  project_description TEXT,
  project_role        VARCHAR(100),
  project_outcome     VARCHAR(200),
  project_link        TEXT,

  -- Step 6: Written responses + preferences
  written_strongest_project TEXT,   -- "Describe your strongest project"
  written_team_role         TEXT,   -- "What role do you take in a team?"
  written_achievement       TEXT,   -- "Your biggest achievement"
  hours_per_week            INTEGER,
  preferred_role            VARCHAR(20),
  preferred_comp_types      TEXT[],
  location_preference       VARCHAR(20),

  -- AI Assessment Result
  ai_verified_skills  JSONB,        -- [{skill, score, verified: true/false}]
  ai_skill_scores     JSONB,        -- {Frontend: 72, Backend: 45, ...}
  ai_initial_elo      INTEGER,
  ai_tier             VARCHAR(20),
  ai_confidence       VARCHAR(10),
  ai_reasoning        TEXT,
  ai_raw_response     TEXT,         -- full raw response for debugging

  -- Status
  status              VARCHAR(20) DEFAULT 'pending'
                      CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  submitted_at        TIMESTAMPTZ DEFAULT NOW(),
  completed_at        TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_assessments_user ON user_assessments(user_id);

SELECT 'Assessment migration complete ✅' AS status;
