-- ============================================================
-- ApexFlow — Migration 004: Agent Memory
-- ============================================================

CREATE TABLE agent_memory (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type        TEXT NOT NULL
                CHECK (type IN (
                  'preference', 'work_pattern', 'project_context',
                  'relationship', 'operating_rule'
                )),
  key         TEXT NOT NULL,
  value       TEXT NOT NULL,

  -- Confidence score 0–1 (decreases if user contradicts)
  confidence  FLOAT NOT NULL DEFAULT 1.0
                CHECK (confidence >= 0.0 AND confidence <= 1.0),

  last_used   TIMESTAMPTZ,
  source      TEXT,  -- conversation ID, 'user_explicit', etc.

  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Unique constraint: one value per memory key
CREATE UNIQUE INDEX idx_agent_memory_key ON agent_memory(key);

CREATE TRIGGER agent_memory_updated_at
  BEFORE UPDATE ON agent_memory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
