-- ============================================================
-- ApexFlow — Migration 003: Activity Log
-- ============================================================

CREATE TABLE activity_log (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action_type        TEXT NOT NULL,
  entity_type        TEXT CHECK (entity_type IN (
                       'task', 'email', 'calendar_event',
                       'document', 'approval', 'memory', 'system'
                     )),
  entity_id          TEXT,
  details            JSONB,
  initiated_by       TEXT NOT NULL DEFAULT 'agent'
                       CHECK (initiated_by IN ('user', 'agent')),
  confirmed_by_user  BOOLEAN,
  reversible         BOOLEAN NOT NULL DEFAULT true,
  -- For undo: store previous state snapshot
  previous_state     JSONB,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
  -- Note: NO updated_at — this is append-only (immutable audit log)
);

-- Indexes
CREATE INDEX idx_activity_log_action_type ON activity_log(action_type);
CREATE INDEX idx_activity_log_entity ON activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at DESC);

-- Row Level Security: users can only see their own logs
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
