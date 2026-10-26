// ============================================================
// ApexFlow — Permission Level Constants
// ============================================================

/**
 * Email Autonomy Levels (Proposal Section 26)
 *
 * Level 0: Read only — no sending
 * Level 1: Draft only — no sending
 * Level 2: Confirm before send — recommended default
 * Level 3: Trusted automation — explicit rules only
 */
export const EMAIL_AUTONOMY = {
  READ_ONLY: 0,
  DRAFT_ONLY: 1,
  CONFIRM_BEFORE_SEND: 2,
  TRUSTED_AUTOMATION: 3,
} as const;

export const EMAIL_AUTONOMY_LABELS: Record<number, string> = {
  0: "Read Only",
  1: "Draft Only",
  2: "Confirm Before Send (Recommended)",
  3: "Trusted Automation",
};

export const EMAIL_AUTONOMY_DEFAULT = EMAIL_AUTONOMY.CONFIRM_BEFORE_SEND;

/**
 * Google Docs Permission Modes (Proposal Section 35)
 */
export const DOCS_MODE = {
  READ: "read",
  SUGGEST: "suggest",
  EDIT: "edit",
} as const;

export const DOCS_MODE_DEFAULT = DOCS_MODE.SUGGEST;

/**
 * Actions that ALWAYS require explicit user confirmation
 * regardless of any automation settings (Proposal Section 27)
 */
export const ALWAYS_CONFIRM_ACTIONS = [
  "email_send_payment",
  "email_send_legal",
  "email_send_contract",
  "email_send_sensitive",
  "email_send_large_group",  // >10 recipients
  "drive_delete",
  "drive_public_share",
  "calendar_external_meeting_delete",
  "reply_all",
] as const;
