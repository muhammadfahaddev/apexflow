// ============================================================
// ApexFlow — Priority Level Constants
// ============================================================

export const PRIORITY = {
  CRITICAL: "critical",
  HIGH: "high",
  NORMAL: "normal",
  LOW: "low",
} as const;

/**
 * Priority score for sorting (higher = more important)
 */
export const PRIORITY_SCORE: Record<string, number> = {
  critical: 1000,
  high: 100,
  normal: 10,
  low: 1,
};

export const PRIORITY_COLORS: Record<string, string> = {
  critical: "#ef4444",  // red-500
  high: "#f97316",      // orange-500
  normal: "#6366f1",    // indigo-500
  low: "#94a3b8",       // slate-400
};

export const PRIORITY_LABELS: Record<string, string> = {
  critical: "Critical",
  high: "High",
  normal: "Normal",
  low: "Low",
};
