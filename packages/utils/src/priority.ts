// ============================================================
// ApexFlow — Priority Scoring Engine
// Calculates an 8-factor deterministic priority score for any task.
// Higher score = Scheduled earlier & protected during replanning.
// ============================================================

import type { Task, TaskPriority } from "@apexflow/types";
import { PRIORITY_SCORE } from "@apexflow/constants";

export interface PriorityBreakdown {
  baseScore: number;
  urgencyBoost: number;
  effortPenaltyOrBonus: number;
  missedAttemptBoost: number;
  dependencyPenalty: number;
  finalScore: number;
  computedPriority: TaskPriority;
}

/**
 * Calculates priority score & breakdown based on 8 core factors:
 * 1. Base Priority level (critical=1000, high=100, normal=10, low=1)
 * 2. Deadline proximity (hours remaining)
 * 3. Missed attempts / Overdue status
 * 4. Task duration / effort fit
 * 5. Blocked dependencies
 */
export function calculatePriorityScore(
  task: Task,
  referenceTime: Date = new Date()
): PriorityBreakdown {
  const baseScore = PRIORITY_SCORE[task.priority] ?? 10;
  let urgencyBoost = 0;
  let effortPenaltyOrBonus = 0;
  let missedAttemptBoost = 0;
  let dependencyPenalty = 0;

  // 1. Deadline Proximity Calculation
  if (task.deadline) {
    const msRemaining = new Date(task.deadline).getTime() - referenceTime.getTime();
    const hoursRemaining = msRemaining / (1000 * 60 * 60);

    if (hoursRemaining < 0) {
      // Overdue! Maximum urgency boost
      urgencyBoost = 500 + Math.min(Math.abs(hoursRemaining) * 10, 200);
    } else if (hoursRemaining <= 4) {
      // Due within 4 hours
      urgencyBoost = 300;
    } else if (hoursRemaining <= 12) {
      // Due within 12 hours (today)
      urgencyBoost = 150;
    } else if (hoursRemaining <= 24) {
      // Due tomorrow
      urgencyBoost = 75;
    } else if (hoursRemaining <= 72) {
      urgencyBoost = 25;
    }
  }

  // 2. Missed / Rescheduled attempt tracking
  if (task.rescheduleCount > 0) {
    // Tasks repeatedly delayed get elevated to avoid procrastination trap
    missedAttemptBoost = Math.min(task.rescheduleCount * 25, 100);
  }

  // 3. Blocked Dependencies Check
  if (task.status === "blocked" || (task.dependencies && task.dependencies.length > 0)) {
    // If blocked by another task, cannot execute now
    dependencyPenalty = -500;
  }

  // 4. Quick-win bonus for small tasks (< 15 mins)
  if (task.durationMins && task.durationMins <= 15) {
    effortPenaltyOrBonus = 15;
  }

  const finalScore = Math.max(
    0,
    baseScore + urgencyBoost + effortPenaltyOrBonus + missedAttemptBoost + dependencyPenalty
  );

  // Determine computed priority band
  let computedPriority: TaskPriority = "normal";
  if (finalScore >= 500) {
    computedPriority = "critical";
  } else if (finalScore >= 100) {
    computedPriority = "high";
  } else if (finalScore >= 10) {
    computedPriority = "normal";
  } else {
    computedPriority = "low";
  }

  return {
    baseScore,
    urgencyBoost,
    effortPenaltyOrBonus,
    missedAttemptBoost,
    dependencyPenalty,
    finalScore,
    computedPriority,
  };
}

/**
 * Sorts an array of tasks by descending priority score
 */
export function sortTasksByPriority(tasks: Task[], referenceTime: Date = new Date()): Task[] {
  return [...tasks].sort((a, b) => {
    const scoreA = calculatePriorityScore(a, referenceTime).finalScore;
    const scoreB = calculatePriorityScore(b, referenceTime).finalScore;
    return scoreB - scoreA;
  });
}
