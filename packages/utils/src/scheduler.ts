// ============================================================
// ApexFlow — Deterministic Daily Plan Scheduler
// Generates realistic, overlap-free daily timelines by protecting
// fixed commitments (meetings/appointments) and dynamically packing
// prioritized tasks into available free-time windows.
// ============================================================

import type { Task, DailyPlan, DailyPlanItem, TaskFlexibility } from "@apexflow/types";
import { sortTasksByPriority, type PriorityEngineConfig } from "./priority";

export interface TimeSlot {
  start: Date;
  end: Date;
  durationMins: number;
}

export interface FixedCommitment {
  id: string;
  title: string;
  start: Date;
  end: Date;
  flexibility: "fixed";
  source?: "calendar" | "manual";
}

/**
 * Dynamic configuration for the Scheduler.
 * All parameters (work hours, buffer times, lunch break, etc.) are customizable.
 */
export interface SchedulerConfig {
  /** Daily work start (24h format, e.g. 9 for 09:00 AM) */
  workStartHour: number;
  workStartMinute: number;
  /** Daily work end (24h format, e.g. 18 for 06:00 PM) */
  workEndHour: number;
  workEndMinute: number;
  /** Buffer time inserted between scheduled blocks (in minutes) */
  bufferBetweenBlocksMins: number;
  /** Default duration in minutes for tasks that don't specify one */
  defaultTaskDurationMins: number;
  /** Minimum remaining slot duration to fit a task */
  minSlotMins: number;
  /** Automatic Lunch break window */
  lunchBreak?: {
    enabled: boolean;
    startHour: number;
    startMinute: number;
    durationMins: number;
    title: string;
  };
  /** Priority engine customization */
  priorityConfig?: Partial<PriorityEngineConfig>;
}

export const DEFAULT_SCHEDULER_CONFIG: SchedulerConfig = {
  workStartHour: 9,
  workStartMinute: 0,
  workEndHour: 18,
  workEndMinute: 0,
  bufferBetweenBlocksMins: 10,
  defaultTaskDurationMins: 45,
  minSlotMins: 15,
  lunchBreak: {
    enabled: true,
    startHour: 13,
    startMinute: 0,
    durationMins: 45,
    title: "Lunch & Recharge",
  },
};

export interface SchedulingResult {
  plan: DailyPlan;
  scheduledTasksCount: number;
  overflowTasks: Task[]; // Tasks that couldn't fit into today's available time
  freeTimeRemainingMins: number;
}

/**
 * Deterministic timeline builder:
 * 1. Establishes the daily work window.
 * 2. Merges fixed calendar events and optional lunch break as unmovable anchors.
 * 3. Identifies and calculates free available intervals.
 * 4. Sorts pending tasks dynamically using Priority Engine.
 * 5. Greedily packs prioritized tasks with appropriate buffers.
 */
export function generateDailyPlan(
  targetDate: Date,
  tasks: Task[],
  fixedEvents: FixedCommitment[] = [],
  customConfig: Partial<SchedulerConfig> = {}
): SchedulingResult {
  const config: SchedulerConfig = {
    ...DEFAULT_SCHEDULER_CONFIG,
    ...customConfig,
    lunchBreak: {
      ...DEFAULT_SCHEDULER_CONFIG.lunchBreak,
      ...customConfig.lunchBreak,
    } as any,
  };

  const dayStart = new Date(targetDate);
  dayStart.setHours(config.workStartHour, config.workStartMinute, 0, 0);

  const dayEnd = new Date(targetDate);
  dayEnd.setHours(config.workEndHour, config.workEndMinute, 0, 0);

  // 1. Collect all fixed anchors (Calendar Events + Lunch)
  const anchors: Array<{ id: string; title: string; start: Date; end: Date; type: "event" | "break" }> = [];

  for (const event of fixedEvents) {
    anchors.push({
      id: event.id,
      title: event.title,
      start: new Date(event.start),
      end: new Date(event.end),
      type: "event",
    });
  }

  // Insert lunch break if enabled and inside work hours
  if (config.lunchBreak?.enabled) {
    const lunchStart = new Date(targetDate);
    lunchStart.setHours(config.lunchBreak.startHour, config.lunchBreak.startMinute, 0, 0);
    const lunchEnd = new Date(lunchStart.getTime() + config.lunchBreak.durationMins * 60000);

    // Only add if not colliding with a fixed meeting
    const collidesWithEvent = anchors.some((a) => a.start < lunchEnd && a.end > lunchStart);
    if (!collidesWithEvent && lunchStart >= dayStart && lunchEnd <= dayEnd) {
      anchors.push({
        id: "fixed-lunch-break",
        title: config.lunchBreak.title,
        start: lunchStart,
        end: lunchEnd,
        type: "break",
      });
    }
  }

  // Sort anchors chronologically
  anchors.sort((a, b) => a.start.getTime() - b.start.getTime());

  // 2. Compute available free intervals between anchors
  const freeSlots: TimeSlot[] = [];
  let currentTimeCursor = new Date(dayStart);

  for (const anchor of anchors) {
    if (anchor.start > currentTimeCursor) {
      const durationMins = (anchor.start.getTime() - currentTimeCursor.getTime()) / 60000;
      if (durationMins >= config.minSlotMins) {
        freeSlots.push({
          start: new Date(currentTimeCursor),
          end: new Date(anchor.start),
          durationMins,
        });
      }
    }
    // Advance cursor past the anchor
    if (anchor.end > currentTimeCursor) {
      currentTimeCursor = new Date(anchor.end);
    }
  }

  // Final free slot until dayEnd
  if (dayEnd > currentTimeCursor) {
    const durationMins = (dayEnd.getTime() - currentTimeCursor.getTime()) / 60000;
    if (durationMins >= config.minSlotMins) {
      freeSlots.push({
        start: new Date(currentTimeCursor),
        end: new Date(dayEnd),
        durationMins,
      });
    }
  }

  // 3. Sort pending tasks dynamically
  const pendingTasks = tasks.filter(
    (t) => t.status !== "completed" && t.status !== "cancelled" && t.status !== "skipped"
  );
  const prioritizedTasks = sortTasksByPriority(pendingTasks, targetDate, config.priorityConfig);

  // 4. Pack tasks into free slots with buffers
  const planItems: DailyPlanItem[] = [];
  const scheduledTaskIds = new Set<string>();
  const bufferMs = config.bufferBetweenBlocksMins * 60000;

  for (const slot of freeSlots) {
    let slotCursor = new Date(slot.start);

    for (const task of prioritizedTasks) {
      if (scheduledTaskIds.has(task.id)) continue;

      const durationMins = task.durationMins || config.defaultTaskDurationMins;
      const durationMs = durationMins * 60000;
      const neededWithBufferMs = durationMs + bufferMs;

      if (slot.end.getTime() - slotCursor.getTime() >= durationMs) {
        const itemStart = new Date(slotCursor);
        const itemEnd = new Date(itemStart.getTime() + durationMs);

        planItems.push({
          id: task.id,
          type: "task",
          title: task.title,
          startTime: itemStart,
          endTime: itemEnd,
          flexibility: task.flexibility || "flexible",
          priority: task.priority,
        });

        scheduledTaskIds.add(task.id);
        slotCursor = new Date(slotCursor.getTime() + neededWithBufferMs);
      }
    }
  }

  // Add the fixed anchors into the final items list
  for (const anchor of anchors) {
    planItems.push({
      id: anchor.id,
      type: anchor.type,
      title: anchor.title,
      startTime: anchor.start,
      endTime: anchor.end,
      flexibility: "fixed",
    });
  }

  // Sort complete day timeline chronologically
  planItems.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  // Calculate overflow (tasks that didn't fit)
  const overflowTasks = prioritizedTasks.filter((t) => !scheduledTaskIds.has(t.id));

  // Calculate remaining free minutes
  const totalWorkMins = (dayEnd.getTime() - dayStart.getTime()) / 60000;
  const scheduledMins = planItems.reduce((acc, item) => {
    return acc + (item.endTime.getTime() - item.startTime.getTime()) / 60000;
  }, 0);
  const freeTimeRemainingMins = Math.max(0, totalWorkMins - scheduledMins);

  const plan: DailyPlan = {
    date: targetDate,
    items: planItems,
    generatedAt: new Date(),
  };

  return {
    plan,
    scheduledTasksCount: scheduledTaskIds.size,
    overflowTasks,
    freeTimeRemainingMins,
  };
}
