-- ============================================================
-- ApexFlow — Migration 002: Tasks
-- ============================================================

CREATE TABLE tasks (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            TEXT NOT NULL,
  description      TEXT,
  category         TEXT,
  project_id       UUID REFERENCES projects(id) ON DELETE SET NULL,

  -- Priority & Status
  priority         TEXT NOT NULL DEFAULT 'normal'
                     CHECK (priority IN ('critical', 'high', 'normal', 'low')),
  status           TEXT NOT NULL DEFAULT 'inbox'
                     CHECK (status IN (
                       'inbox', 'planned', 'scheduled', 'in_progress',
                       'waiting', 'blocked', 'completed', 'delayed',
                       'skipped', 'cancelled'
                     )),
  flexibility      TEXT NOT NULL DEFAULT 'flexible'
                     CHECK (flexibility IN ('fixed', 'flexible', 'semi_flexible')),

  -- Timing
  deadline         TIMESTAMPTZ,
  preferred_time   TIMESTAMPTZ,
  duration_mins    INTEGER,

  -- Recurrence (JSON): { type, interval, daysOfWeek, endsAt }
  recurrence       JSONB,

  -- Dependencies: array of task UUIDs
  dependencies     UUID[] DEFAULT '{}',

  -- Reminder config (JSON): { beforeMins, atStart, followUpMins }
  reminder_config  JSONB DEFAULT '{"beforeMins": [15], "atStart": true}',

  -- Source tracking
  source           TEXT NOT NULL DEFAULT 'manual'
                     CHECK (source IN (
                       'manual', 'email', 'calendar', 'document', 'agent'
                     )),
  source_ref       TEXT,  -- email ID, calendar event ID, etc.

  -- Execution tracking
  planned_start    TIMESTAMPTZ,
  actual_start     TIMESTAMPTZ,
  planned_end      TIMESTAMPTZ,
  actual_end       TIMESTAMPTZ,
  reschedule_count INTEGER NOT NULL DEFAULT 0,
  reminder_count   INTEGER NOT NULL DEFAULT 0,

  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Indexes for common queries
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
