// ============================================================
// ApexFlow — Emergency Rescheduler Unit Tests
// Tests emergency insertion, flexible task shifts & fixed conflict flags
// ============================================================

import { describe, it, expect } from "vitest";
import { executeEmergencyReplan } from "../src/rescheduler";
import type { DailyPlan, Task } from "@apexflow/types";
import type { FixedCommitment } from "../src/scheduler";

describe("Adaptive Rescheduler & Emergency Mode", () => {
  const targetDate = new Date("2026-10-26T00:00:00Z");

  const initialPlan: DailyPlan = {
    date: targetDate,
    generatedAt: new Date(),
    items: [
      {
        id: "task-morning",
        title: "Morning Task",
        startTime: new Date("2026-10-26T09:00:00Z"),
        endTime: new Date("2026-10-26T10:00:00Z"),
        flexibility: "flexible",
        type: "task",
      },
      {
        id: "task-afternoon",
        title: "Afternoon Task",
        startTime: new Date("2026-10-26T14:00:00Z"),
        endTime: new Date("2026-10-26T15:00:00Z"),
        flexibility: "flexible",
        type: "task",
      },
      {
        id: "meeting-critical",
        title: "Board Meeting",
        startTime: new Date("2026-10-26T14:30:00Z"),
        endTime: new Date("2026-10-26T15:30:00Z"),
        flexibility: "fixed",
        type: "event",
      },
    ],
  };

  const tasks: Task[] = [
    {
      id: "task-afternoon",
      title: "Afternoon Task",
      priority: "normal",
      status: "inbox",
      flexibility: "flexible",
      durationMins: 60,
      source: "manual",
      rescheduleCount: 0,
      reminderCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const fixedEvents: FixedCommitment[] = [
    {
      id: "meeting-critical",
      title: "Board Meeting",
      start: new Date("2026-10-26T14:30:00Z"),
      end: new Date("2026-10-26T15:30:00Z"),
      flexibility: "fixed",
    },
  ];

  it("should detect colliding fixed meetings during emergency window", () => {
    const result = executeEmergencyReplan({
      currentPlan: initialPlan,
      emergency: {
        startTime: new Date("2026-10-26T14:00:00Z"),
        endTime: new Date("2026-10-26T16:00:00Z"),
        reason: "Family Emergency",
      },
      allPendingTasks: tasks,
      fixedEvents,
    });

    expect(result.diff.conflictingFixedEvents.length).toBe(1);
    expect(result.diff.conflictingFixedEvents[0].id).toBe("meeting-critical");
    expect(result.summaryMessage).toContain("fixed calendar meeting(s) coincide");
  });

  it("should shift flexible tasks past the emergency block", () => {
    // In this test, morning (9 AM - 2 PM) is occupied by other tasks,
    // and emergency occupies 2 PM - 4 PM.
    // The flexible task must be rescheduled after 4 PM.
    const morningBlock: FixedCommitment = {
      id: "morning-busy",
      title: "Morning Deep Work",
      start: new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 9, 0),
      end: new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 14, 0),
      flexibility: "fixed",
    };

    const emergencyStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 14, 0);
    const emergencyEnd = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 16, 0);

    const result = executeEmergencyReplan({
      currentPlan: initialPlan,
      emergency: {
        startTime: emergencyStart,
        endTime: emergencyEnd,
        reason: "Car Breakdown",
      },
      allPendingTasks: tasks,
      fixedEvents: [morningBlock],
    });

    const shiftedTask = result.revisedPlan.items.find((i) => i.id === "task-afternoon");
    expect(shiftedTask).toBeDefined();
    // Must start at or after emergency ends (16:00 / 4 PM)
    expect(new Date(shiftedTask!.startTime).getTime()).toBeGreaterThanOrEqual(emergencyEnd.getTime());
  });
});
