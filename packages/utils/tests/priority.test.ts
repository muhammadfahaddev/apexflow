// ============================================================
// ApexFlow — Comprehensive Priority Engine Unit Tests
// Tests 8-factor scoring, dynamic configs, deadlines & penalties
// ============================================================

import { describe, it, expect } from "vitest";
import { calculatePriorityScore, sortTasksByPriority, DEFAULT_PRIORITY_CONFIG } from "../src/priority";
import type { Task } from "@apexflow/types";

describe("Priority Engine", () => {
  const baseTask: Task = {
    id: "task-1",
    title: "Test Task",
    priority: "normal",
    status: "inbox",
    flexibility: "flexible",
    source: "manual",
    rescheduleCount: 0,
    reminderCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it("should calculate correct base scores for priority bands", () => {
    const criticalScore = calculatePriorityScore({ ...baseTask, priority: "critical" });
    const highScore = calculatePriorityScore({ ...baseTask, priority: "high" });
    const normalScore = calculatePriorityScore({ ...baseTask, priority: "normal" });
    const lowScore = calculatePriorityScore({ ...baseTask, priority: "low" });

    expect(criticalScore.baseScore).toBe(1000);
    expect(highScore.baseScore).toBe(100);
    expect(normalScore.baseScore).toBe(10);
    expect(lowScore.baseScore).toBe(1);
  });

  it("should apply urgency boost for deadlines within 4 hours", () => {
    const now = new Date("2026-10-26T10:00:00Z");
    const dueSoon = new Date("2026-10-26T12:00:00Z"); // 2 hours remaining

    const score = calculatePriorityScore(
      { ...baseTask, deadline: dueSoon },
      now
    );

    expect(score.urgencyBoost).toBe(DEFAULT_PRIORITY_CONFIG.urgencyBoosts.under4Hours);
    expect(score.finalScore).toBe(10 + 300); // normal base (10) + 300 boost
  });

  it("should apply maximum boost for overdue tasks", () => {
    const now = new Date("2026-10-26T14:00:00Z");
    const overdue = new Date("2026-10-26T10:00:00Z"); // 4 hours overdue

    const score = calculatePriorityScore(
      { ...baseTask, deadline: overdue },
      now
    );

    // overdueBase (500) + 4 * 10 (40) = 540
    expect(score.urgencyBoost).toBe(540);
    expect(score.computedPriority).toBe("critical");
  });

  it("should apply heavy penalty for blocked tasks", () => {
    const score = calculatePriorityScore({
      ...baseTask,
      status: "blocked",
      dependencies: ["other-task-uuid"],
    });

    expect(score.dependencyPenalty).toBe(-500);
    expect(score.finalScore).toBe(0); // Cannot drop below 0
    expect(score.computedPriority).toBe("low");
  });

  it("should award quick-win bonus for short tasks (<= 15 mins)", () => {
    const score = calculatePriorityScore({
      ...baseTask,
      durationMins: 10,
    });

    expect(score.effortPenaltyOrBonus).toBe(15);
    expect(score.finalScore).toBe(10 + 15);
  });

  it("should sort tasks properly by descending final score", () => {
    const now = new Date("2026-10-26T10:00:00Z");

    const t1: Task = { ...baseTask, id: "1", priority: "low" };
    const t2: Task = { ...baseTask, id: "2", priority: "critical" };
    const t3: Task = {
      ...baseTask,
      id: "3",
      priority: "normal",
      deadline: new Date("2026-10-26T11:00:00Z"), // due in 1 hour
    };

    const sorted = sortTasksByPriority([t1, t2, t3], now);

    // t2 (critical = 1000) > t3 (normal 10 + 300 = 310) > t1 (low = 1)
    expect(sorted.map((t) => t.id)).toEqual(["2", "3", "1"]);
  });
});
