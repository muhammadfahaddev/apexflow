-- ============================================================
-- ApexFlow — Migration 005: Approvals (Inbox)
-- ============================================================

CREATE TABLE approvals (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type        TEXT NOT NULL CHECK (type IN (
                'email_send', 'email_reply_all',
                'calendar_event_change', 'calendar_event_delete',
                'document_edit', 'drive_share', 'drive_delete',
                'task_auto_complete'
              )),
  title       TEXT NOT NULL,
  description TEXT,

  -- Full action payload — agent will execute this if approved
  payload     JSONB NOT NULL,

  -- Preview data — shown to user (safe subset of payload)
  preview     JSONB,

  status      TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  reviewed_at TIMESTAMPTZ,

  -- Auto-expire pending approvals after 24 hours
  expires_at  TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '24 hours',

  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_approvals_status ON approvals(status);
CREATE INDEX idx_approvals_expires_at ON approvals(expires_at);
