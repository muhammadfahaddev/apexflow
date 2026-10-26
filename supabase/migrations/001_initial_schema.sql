-- ============================================================
-- ApexFlow — Migration 001: Initial Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects
CREATE TABLE projects (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  description TEXT,
  color       TEXT,
  drive_folder_id TEXT,
  status      TEXT NOT NULL DEFAULT 'active'
                CHECK (status IN ('active', 'paused', 'completed', 'archived')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User Settings
CREATE TABLE user_settings (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- AI Provider
  ai_provider           TEXT NOT NULL DEFAULT 'gemini',
  ai_model              TEXT,
  -- Email permissions
  email_autonomy_level  INTEGER NOT NULL DEFAULT 2
                          CHECK (email_autonomy_level BETWEEN 0 AND 3),
  -- Docs permissions
  docs_mode             TEXT NOT NULL DEFAULT 'suggest'
                          CHECK (docs_mode IN ('read', 'suggest', 'edit')),
  -- Agent mode
  agent_mode            TEXT NOT NULL DEFAULT 'normal'
                          CHECK (agent_mode IN (
                            'normal', 'focus', 'busy',
                            'emergency', 'do_not_disturb', 'review'
                          )),
  -- Working hours
  work_start_hour       INTEGER NOT NULL DEFAULT 9,
  work_end_hour         INTEGER NOT NULL DEFAULT 18,
  -- Quiet hours
  quiet_start_hour      INTEGER NOT NULL DEFAULT 23,
  quiet_end_hour        INTEGER NOT NULL DEFAULT 7,
  -- Integrations enabled
  gmail_enabled         BOOLEAN NOT NULL DEFAULT false,
  calendar_enabled      BOOLEAN NOT NULL DEFAULT false,
  drive_enabled         BOOLEAN NOT NULL DEFAULT false,
  docs_enabled          BOOLEAN NOT NULL DEFAULT false,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger: auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
