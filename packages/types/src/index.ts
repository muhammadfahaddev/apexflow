// ============================================================
// ApexFlow — Shared TypeScript Types
// All types used across web and mobile apps
// ============================================================

// ── Task ────────────────────────────────────────────────────

export type TaskStatus =
  | "inbox"
  | "planned"
  | "scheduled"
  | "in_progress"
  | "waiting"
  | "blocked"
  | "completed"
  | "delayed"
  | "skipped"
  | "cancelled";

export type TaskPriority = "critical" | "high" | "normal" | "low";

export type TaskFlexibility = "fixed" | "flexible" | "semi_flexible";

export type TaskSource =
  | "manual"
  | "email"
  | "calendar"
  | "document"
  | "agent";

export interface Task {
  id: string;
  title: string;
  description?: string;
  category?: string;
  projectId?: string;
  priority: TaskPriority;
  deadline?: Date;
  preferredTime?: Date;
  durationMins?: number;
  status: TaskStatus;
  flexibility: TaskFlexibility;
  recurrence?: RecurrenceRule;
  dependencies?: string[];
  reminderConfig?: ReminderConfig;
  source: TaskSource;
  plannedStart?: Date;
  actualStart?: Date;
  plannedEnd?: Date;
  actualEnd?: Date;
  rescheduleCount: number;
  reminderCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecurrenceRule {
  type: "daily" | "weekly" | "monthly" | "custom";
  interval?: number;
  daysOfWeek?: number[];
  endsAt?: Date;
}

export interface ReminderConfig {
  beforeMins: number[];   // e.g. [15, 5] = remind 15 and 5 mins before
  atStart: boolean;
  followUpMins?: number;  // how long after start to send overdue reminder
}

// ── Project ─────────────────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  description?: string;
  color?: string;
  driveFolderId?: string;  // linked Google Drive folder
  status: "active" | "paused" | "completed" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

// ── Daily Plan ───────────────────────────────────────────────

export interface DailyPlan {
  date: Date;
  items: DailyPlanItem[];
  generatedAt: Date;
  emergencyMode?: EmergencyPeriod;
}

export interface DailyPlanItem {
  type: "task" | "event" | "break";
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  flexibility: TaskFlexibility;
  priority?: TaskPriority;
}

export interface EmergencyPeriod {
  startTime: Date;
  endTime: Date;
  reason?: string;
  activatedAt: Date;
}

// ── Activity Log ─────────────────────────────────────────────

export type ActivityActionType =
  | "daily_plan_generated"
  | "task_created"
  | "task_completed"
  | "task_rescheduled"
  | "task_skipped"
  | "reminder_sent"
  | "emergency_mode_activated"
  | "emergency_mode_ended"
  | "email_received"
  | "email_sent"
  | "email_draft_created"
  | "calendar_event_created"
  | "calendar_event_updated"
  | "document_updated"
  | "approval_requested"
  | "approval_approved"
  | "approval_rejected"
  | "memory_updated"
  | "agent_suggestion";

export interface ActivityLog {
  id: string;
  actionType: ActivityActionType;
  entityType?: "task" | "email" | "calendar_event" | "document" | "approval";
  entityId?: string;
  details?: Record<string, unknown>;
  initiatedBy: "user" | "agent";
  confirmedByUser?: boolean;
  reversible: boolean;
  createdAt: Date;
}

// ── Agent Memory ─────────────────────────────────────────────

export type MemoryType =
  | "preference"
  | "work_pattern"
  | "project_context"
  | "relationship"
  | "operating_rule";

export interface AgentMemory {
  id: string;
  type: MemoryType;
  key: string;
  value: string;
  confidence: number;  // 0–1
  lastUsed?: Date;
  source?: string;
  createdAt: Date;
}

// ── Approval ─────────────────────────────────────────────────

export type ApprovalType =
  | "email_send"
  | "email_reply_all"
  | "calendar_event_change"
  | "calendar_event_delete"
  | "document_edit"
  | "drive_share"
  | "drive_delete"
  | "task_auto_complete";

export type ApprovalStatus = "pending" | "approved" | "rejected" | "expired";

export interface Approval {
  id: string;
  type: ApprovalType;
  title: string;
  description?: string;
  payload: Record<string, unknown>;
  status: ApprovalStatus;
  reviewedAt?: Date;
  createdAt: Date;
}

// ── Agent Modes ──────────────────────────────────────────────

export type AgentMode =
  | "normal"
  | "focus"
  | "busy"
  | "emergency"
  | "do_not_disturb"
  | "review";

// ── AI Provider ──────────────────────────────────────────────

export type AIProviderType =
  | "gemini"
  | "openai"
  | "claude"
  | "ollama"
  | "custom";

export interface AIProviderConfig {
  provider: AIProviderType;
  apiKey?: string;
  model?: string;
  baseUrl?: string;
}

// ── Notification ─────────────────────────────────────────────

export type NotificationPriority = "critical" | "important" | "normal" | "silent";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  priority: NotificationPriority;
  actions?: NotificationAction[];
  data?: Record<string, unknown>;
}

export interface NotificationAction {
  id: string;
  label: string;
  type:
    | "task_done"
    | "task_start"
    | "task_skip"
    | "snooze_15"
    | "snooze_30"
    | "snooze_60"
    | "reschedule"
    | "emergency"
    | "approve"
    | "reject"
    | "open_app";
}
