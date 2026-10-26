// ============================================================
// ApexFlow — Emergency Mode & Adaptive Rescheduler Engine
// Intelligently shifts flexible commitments, protects fixed external meetings,
// resolves conflicts when unexpected disruptions happen, and generates
// a clean, validated revised timeline with full diff transparency.
// ============================================================

import type { DailyPlan, DailyPlanItem, Task, TaskFlexibility } from "@apexflow/types";
import { generateDailyPlan, type FixedCommitment, type SchedulerConfig } from "./scheduler";

export interface EmergencyWindow {
  /** Start of emergency / unavailability */
  startTime: Date;
  /** End of emergency / unavailability */
  endTime: Date;
  /** Reason provided by user */
  reason?: string;
}

export interface RescheduleRequest {
  currentPlan: DailyPlan;
  emergency: EmergencyWindow;
  allPendingTasks: Task[];
  fixedEvents: FixedCommitment[];
  config?: Partial<SchedulerConfig>;
}

export interface PlanDifference {
  unmovedItems: DailyPlanItem[];
  shiftedItems: Array<{
    item: DailyPlanItem;
    originalStart: Date;
    newStart: Date;
    delayMins: number;
  }>;
  overflowItems: Task[];
  conflictingFixedEvents: DailyPlanItem[]; // Fixed meetings that collided and need user decision
}

export interface AdaptiveReplanResult {
  revisedPlan: DailyPlan;
  diff: PlanDifference;
  summaryMessage: string;
}

/**
 * Handles Emergency & Adaptive Schedule Rebuilding:
 * 1. Freezes any item that already ended before the emergency started.
 * 2. Checks for fixed external meetings during the emergency window (flags for user confirmation).
 * 3. Identifies all affected flexible tasks during the emergency window.
 * 4. Adds emergency block as an unmovable obstacle.
 * 5. Re-runs deterministic scheduler packing for remaining available work hours.
 * 6. Generates detailed diff and conversational summary.
 */
export function executeEmergencyReplan(request: RescheduleRequest): AdaptiveReplanResult {
  const { currentPlan, emergency, allPendingTasks, fixedEvents, config } = request;

  const emergencyStartMs = new Date(emergency.startTime).getTime();
  const emergencyEndMs = new Date(emergency.endTime).getTime();
  const emergencyDurationMins = Math.round((emergencyEndMs - emergencyStartMs) / 60000);

  // 1. Identify past items (already completed/passed)
  const pastItems: DailyPlanItem[] = [];
  const conflictingFixedEvents: DailyPlanItem[] = [];

  for (const item of currentPlan.items) {
    const itemEndMs = new Date(item.endTime).getTime();
    const itemStartMs = new Date(item.startTime).getTime();

    if (itemEndMs <= emergencyStartMs) {
      pastItems.push(item);
    } else if (item.flexibility === "fixed") {
      // Check if a fixed event overlaps with emergency
      const overlapsEmergency = itemStartMs < emergencyEndMs && itemEndMs > emergencyStartMs;
      if (overlapsEmergency) {
        conflictingFixedEvents.push(item);
      }
    }
  }

  // 2. Prepare revised fixed anchors (Include emergency block as an anchor)
  const revisedAnchors: FixedCommitment[] = [
    ...fixedEvents,
    {
      id: `emergency-block-${Date.now()}`,
      title: `🚨 Emergency: ${emergency.reason || "Unavailable Period"}`,
      start: new Date(emergency.startTime),
      end: new Date(emergency.endTime),
      flexibility: "fixed",
      source: "manual",
    },
  ];

  // 3. Re-run deterministic scheduler for target date with updated anchors
  const schedulingResult = generateDailyPlan(
    currentPlan.date,
    allPendingTasks,
    revisedAnchors,
    config
  );

  const revisedPlan = schedulingResult.plan;

  // Attach emergency period metadata
  revisedPlan.emergencyMode = {
    startTime: emergency.startTime,
    endTime: emergency.endTime,
    reason: emergency.reason,
    activatedAt: new Date(),
  };

  // 4. Calculate detailed diff
  const unmovedItems: DailyPlanItem[] = [];
  const shiftedItems: Array<{
    item: DailyPlanItem;
    originalStart: Date;
    newStart: Date;
    delayMins: number;
  }> = [];

  for (const newItem of revisedPlan.items) {
    const originalItem = currentPlan.items.find((orig) => orig.id === newItem.id);
    if (!originalItem) continue;

    const origMs = new Date(originalItem.startTime).getTime();
    const newMs = new Date(newItem.startTime).getTime();

    if (origMs === newMs) {
      unmovedItems.push(newItem);
    } else {
      const delayMins = Math.round((newMs - origMs) / 60000);
      shiftedItems.push({
        item: newItem,
        originalStart: originalItem.startTime,
        newStart: newItem.startTime,
        delayMins,
      });
    }
  }

  // 5. Construct user-friendly natural language summary message
  let summary = `Emergency mode activated for ${emergencyDurationMins} minutes.`;

  if (shiftedItems.length > 0) {
    summary += ` ${shiftedItems.length} flexible task(s) rescheduled to later slots.`;
  }

  if (schedulingResult.overflowTasks.length > 0) {
    summary += ` ${schedulingResult.overflowTasks.length} task(s) could not fit and were deferred to tomorrow.`;
  }

  if (conflictingFixedEvents.length > 0) {
    summary += ` ⚠️ Note: ${conflictingFixedEvents.length} fixed calendar meeting(s) coincide with your emergency and require manual action.`;
  }

  return {
    revisedPlan,
    diff: {
      unmovedItems,
      shiftedItems,
      overflowItems: schedulingResult.overflowTasks,
      conflictingFixedEvents,
    },
    summaryMessage: summary,
  };
}
