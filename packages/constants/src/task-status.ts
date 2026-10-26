// ============================================================
// ApexFlow — Task Status Constants
// ============================================================

export const TASK_STATUS = {
  INBOX: "inbox",
  PLANNED: "planned",
  SCHEDULED: "scheduled",
  IN_PROGRESS: "in_progress",
  WAITING: "waiting",
  BLOCKED: "blocked",
  COMPLETED: "completed",
  DELAYED: "delayed",
  SKIPPED: "skipped",
  CANCELLED: "cancelled",
} as const;

export const TASK_STATUS_LABELS: Record<string, string> = {
  inbox: "Inbox",
  planned: "Planned",
  scheduled: "Scheduled",
  in_progress: "In Progress",
  waiting: "Waiting",
  blocked: "Blocked",
  completed: "Completed",
  delayed: "Delayed",
  skipped: "Skipped",
  cancelled: "Cancelled",
};

export const ACTIVE_STATUSES = [
  TASK_STATUS.INBOX,
  TASK_STATUS.PLANNED,
  TASK_STATUS.SCHEDULED,
  TASK_STATUS.IN_PROGRESS,
  TASK_STATUS.WAITING,
  TASK_STATUS.BLOCKED,
  TASK_STATUS.DELAYED,
];

export const DONE_STATUSES = [
  TASK_STATUS.COMPLETED,
  TASK_STATUS.SKIPPED,
  TASK_STATUS.CANCELLED,
];
