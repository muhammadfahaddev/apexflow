// ============================================================
// ApexFlow — Dynamic Priority Scoring Engine
// Allows fully dynamic configuration for weights, boosts,
// penalties, and threshold limits per user preference or workspace mode.
// ============================================================

import type { Task, TaskPriority } from "@apexflow/types";

/**
 * Dynamic configuration for Priority Engine calculations.
 * Users can customize these weights via Settings UI or Agent Memory.
 */
export interface PriorityEngineConfig {
  baseScores: {
    critical: number;
    high: number;
    normal: number;
    low: number;
  };
  urgencyBoosts: {
    overdueBase: number;
    overdueHourlyMultiplier: number;
    overdueMaxCap: number;
    under4Hours: number;
    under12Hours: number;
    under24Hours: number;
    under72Hours: number;
  };
  procrastination: {
    boostPerReschedule: number;
    maxCap: number;
  };
  dependencies: {
    blockedPenalty: number;
  };
  quickWin: {
    maxDurationMins: number;
    bonusScore: number;
  };
  thresholds: {
    criticalThreshold: number;
    highThreshold: number;
    normalThreshold: number;
  };
}

/**
 * Default Dynamic Priority Configuration
 */
export const DEFAULT_PRIORITY_CONFIG: PriorityEngineConfig = {
  baseScores: {
    critical: 1000,
    high: 100,
    normal: 10,
    low: 1,
  },
  urgencyBoosts: {
    overdueBase: 500,
    overdueHourlyMultiplier: 10,
    overdueMaxCap: 200,
    under4Hours: 300,
    under12Hours: 150,
    under24Hours: 75,
    under72Hours: 25,
  },
  procrastination: {
    boostPerReschedule: 25,
    maxCap: 100,
  },
  dependencies: {
    blockedPenalty: -500,
  },
  quickWin: {
    maxDurationMins: 15,
    bonusScore: 15,
  },
  thresholds: {
    criticalThreshold: 500,
    highThreshold: 100,
    normalThreshold: 10,
  },
};

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
 * Calculates priority score dynamically using the provided or default config.
 */
export function calculatePriorityScore(
  task: Task,
  referenceTime: Date = new Date(),
  config: Partial<PriorityEngineConfig> = {}
): PriorityBreakdown {
  // Merge user provided custom config with default config
  const activeConfig: PriorityEngineConfig = {
    ...DEFAULT_PRIORITY_CONFIG,
    ...config,
    baseScores: { ...DEFAULT_PRIORITY_CONFIG.baseScores, ...config.baseScores },
    urgencyBoosts: { ...DEFAULT_PRIORITY_CONFIG.urgencyBoosts, ...config.urgencyBoosts },
    procrastination: { ...DEFAULT_PRIORITY_CONFIG.procrastination, ...config.procrastination },
    dependencies: { ...DEFAULT_PRIORITY_CONFIG.dependencies, ...config.dependencies },
    quickWin: { ...DEFAULT_PRIORITY_CONFIG.quickWin, ...config.quickWin },
    thresholds: { ...DEFAULT_PRIORITY_CONFIG.thresholds, ...config.thresholds },
  };

  const baseScore = activeConfig.baseScores[task.priority] ?? activeConfig.baseScores.normal;
  let urgencyBoost = 0;
  let effortPenaltyOrBonus = 0;
  let missedAttemptBoost = 0;
  let dependencyPenalty = 0;

  // 1. Dynamic Deadline Urgency Boost
  if (task.deadline) {
    const msRemaining = new Date(task.deadline).getTime() - referenceTime.getTime();
    const hoursRemaining = msRemaining / (1000 * 60 * 60);

    if (hoursRemaining < 0) {
      // Overdue! Base boost + dynamic hourly penalty capped
      const additional = Math.min(
        Math.abs(hoursRemaining) * activeConfig.urgencyBoosts.overdueHourlyMultiplier,
        activeConfig.urgencyBoosts.overdueMaxCap
      );
      urgencyBoost = activeConfig.urgencyBoosts.overdueBase + additional;
    } else if (hoursRemaining <= 4) {
      urgencyBoost = activeConfig.urgencyBoosts.under4Hours;
    } else if (hoursRemaining <= 12) {
      urgencyBoost = activeConfig.urgencyBoosts.under12Hours;
    } else if (hoursRemaining <= 24) {
      urgencyBoost = activeConfig.urgencyBoosts.under24Hours;
    } else if (hoursRemaining <= 72) {
      urgencyBoost = activeConfig.urgencyBoosts.under72Hours;
    }
  }

  // 2. Dynamic Procrastination / Reschedule Boost
  if (task.rescheduleCount > 0) {
    missedAttemptBoost = Math.min(
      task.rescheduleCount * activeConfig.procrastination.boostPerReschedule,
      activeConfig.procrastination.maxCap
    );
  }

  // 3. Dynamic Blocked Dependency Penalty
  if (task.status === "blocked" || (task.dependencies && task.dependencies.length > 0)) {
    dependencyPenalty = activeConfig.dependencies.blockedPenalty;
  }

  // 4. Dynamic Quick-Win Bonus
  if (task.durationMins && task.durationMins <= activeConfig.quickWin.maxDurationMins) {
    effortPenaltyOrBonus = activeConfig.quickWin.bonusScore;
  }

  const finalScore = Math.max(
    0,
    baseScore + urgencyBoost + effortPenaltyOrBonus + missedAttemptBoost + dependencyPenalty
  );

  // 5. Dynamic Computed Priority Bands
  let computedPriority: TaskPriority = "low";
  if (finalScore >= activeConfig.thresholds.criticalThreshold) {
    computedPriority = "critical";
  } else if (finalScore >= activeConfig.thresholds.highThreshold) {
    computedPriority = "high";
  } else if (finalScore >= activeConfig.thresholds.normalThreshold) {
    computedPriority = "normal";
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
 * Sorts tasks dynamically by priority score using custom or default config
 */
export function sortTasksByPriority(
  tasks: Task[],
  referenceTime: Date = new Date(),
  config?: Partial<PriorityEngineConfig>
): Task[] {
  return [...tasks].sort((a, b) => {
    const scoreA = calculatePriorityScore(a, referenceTime, config).finalScore;
    const scoreB = calculatePriorityScore(b, referenceTime, config).finalScore;
    return scoreB - scoreA;
  });
}
