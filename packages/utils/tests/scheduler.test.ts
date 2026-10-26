// ============================================================
// ApexFlow — Deterministic Daily Plan Scheduler Unit Tests
// Tests overlap elimination, anchor preservation & overflow
// ============================================================

import { describe, it, expect } from "vitest";
import { generateDailyPlan, type FixedCommitment } from "../src/scheduler";
import type { Task } from "@apexflow/types";

describe("Deterministic Daily Scheduler", () => {
  const targetDate = new Date("2026-10-26T00:00:00Z");

  const fixedMeeting: FixedCommitment = {
    id: "meeting-1",
    title: "Client Sync",
    start: new Date("2026-10-26T10:00:00Z"),
    end: new Date("2026-10-26T11:00:00Z"),
    flexibility: "fixed",
  };

  const tasks: Task[] = [
    {
      id: "task-1",
      title: "Critical Proposal",
      priority: "critical",
      status: "inbox",
      flexibility: "flexible",
      durationMins: 60,
      source: "manual",
      rescheduleCount: 0,
      reminderCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "task-2",
      title: "Review Design",
      priority: "normal",
      status: "inbox",
      flexibility: "flexible",
      durationMins: 45,
      source: "manual",
      rescheduleCount: 0,
      reminderCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  it("should preserve fixed meetings without moving them", () => {
    const result = generateDailyPlan(targetDate, tasks, [fixedMeeting]);
    const meetingItem = result.plan.items.find((i) => i.id === "meeting-1");

    expect(meetingItem).toBeDefined();
    expect(meetingItem?.flexibility).toBe("fixed");
    expect(new Date(meetingItem!.startTime).toISOString()).toBe(fixedMeeting.start.toISOString());
    expect(new Date(meetingItem!.endTime).toISOString()).toBe(fixedMeeting.end.toISOString());
  });

  it("should ensure zero overlaps between scheduled items", () => {
    const result = generateDailyPlan(targetDate, tasks, [fixedMeeting]);
    const items = result.plan.items;

    for (let i = 0; i < items.length - 1; i++) {
      const currentEnd = new Date(items[i].endTime).getTime();
      const nextStart = new Date(items[i + 1].startTime).getTime();
      expect(currentEnd).toBeLessThanOrEqual(nextStart);
    }
  });

  it("should detect overflow tasks if workday capacity is exceeded", () => {
    // Huge task that cannot fit into standard day
    const hugeTask: Task = {
      ...tasks[0],
      id: "huge-task",
      title: "10-hour mega task",
      durationMins: 600,
    };

    const result = generateDailyPlan(targetDate, [hugeTask], [fixedMeeting]);

    expect(result.overflowTasks.some((t) => t.id === "huge-task")).toBe(true);
  });
});
