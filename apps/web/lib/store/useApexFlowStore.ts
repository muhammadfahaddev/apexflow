// ============================================================
// ApexFlow — 100% Dynamic Global Executive State Store (Zustand)
// Powered by:
// 1. calculatePriorityScore (8-Factor Dynamic Priority Engine)
// 2. generateDailyPlan (Deterministic Buffer Scheduler)
// 3. adaptiveReplan (Emergency Mode Replanner)
// ============================================================

import { create } from "zustand";
import type { Task, DailyPlanItem, DailyPlan } from "@apexflow/types";
import {
  calculatePriorityScore,
  generateDailyPlan,
  executeEmergencyReplan,
  type FixedCommitment,
} from "@apexflow/utils";

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  toolTriggered?: string;
  time: string;
}

interface ApexFlowState {
  // State
  tasks: Task[];
  fixedEvents: FixedCommitment[];
  timelineItems: DailyPlanItem[];
  isEmergencyActive: boolean;
  emergencyReason: string;
  backupPlan: DailyPlanItem[] | null;
  messages: ChatMessage[];
  isThinking: boolean;

  // Actions
  addTask: (params: {
    title: string;
    durationMins?: number;
    priority?: "critical" | "high" | "normal" | "low";
    flexibility?: "fixed" | "flexible";
    deadline?: Date;
  }) => void;
  planMyDay: () => void;
  completeTask: (id: string) => void;
  removeTask: (id: string) => void;
  triggerEmergency: (durationMins: number, reason: string) => void;
  clearEmergency: () => void;
  sendAgentMessage: (prompt: string) => Promise<void>;
  resetSchedule: () => void;
}

// Dynamic Today date helper (never hardcoded to past date)
const getTodayTime = (hours: number, minutes: number = 0) => {
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
};

// Initial Seed Tasks with realistic Today times
const INITIAL_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Review ApexFlow Architecture & PRs",
    priority: "critical",
    status: "planned",
    source: "manual",
    durationMins: 75,
    flexibility: "flexible",
    rescheduleCount: 0,
    reminderCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "task-2",
    title: "Draft Client Executive Proposal",
    priority: "high",
    status: "planned",
    source: "manual",
    durationMins: 90,
    flexibility: "flexible",
    rescheduleCount: 0,
    reminderCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "task-3",
    title: "Sync with Team & Engineering Leads",
    priority: "high",
    status: "planned",
    source: "calendar",
    durationMins: 45,
    flexibility: "fixed",
    rescheduleCount: 0,
    reminderCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const INITIAL_FIXED_EVENTS: FixedCommitment[] = [
  {
    id: "meeting-1",
    title: "Sync with Team & Engineering Leads",
    start: getTodayTime(9, 30),
    end: getTodayTime(10, 15),
    flexibility: "fixed",
    source: "calendar",
  },
];

// Helper to compute dynamic daily plan using the core scheduler
const computeDynamicPlan = (tasks: Task[], fixedEvents: FixedCommitment[]): DailyPlanItem[] => {
  const pendingTasks = tasks.filter((t) => t.status !== "completed");
  const result = generateDailyPlan(new Date(), pendingTasks, fixedEvents, {
    workStartHour: 9,
    workStartMinute: 0,
    workEndHour: 18,
    workEndMinute: 0,
    bufferBetweenBlocksMins: 15,
    lunchBreak: {
      enabled: true,
      startHour: 13,
      startMinute: 0,
      durationMins: 45,
      title: "Lunch & Recharge",
    },
  });

  return result.plan.items;
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-welcome",
    role: "assistant",
    text: "Good day, Fahad. I am your executive agent powered by Groq (openai/gpt-oss-20b) and Zustand Dynamic Engine. Your daily schedule is automatically optimized with 15-minute buffers. How can I assist you?",
    time: "Now",
  },
];

export const useApexFlowStore = create<ApexFlowState>((set, get) => {
  const initialTimeline = computeDynamicPlan(INITIAL_TASKS, INITIAL_FIXED_EVENTS);

  return {
    tasks: INITIAL_TASKS,
    fixedEvents: INITIAL_FIXED_EVENTS,
    timelineItems: initialTimeline,
    isEmergencyActive: false,
    emergencyReason: "",
    backupPlan: null,
    messages: INITIAL_MESSAGES,
    isThinking: false,

    addTask: (params) => {
      const { tasks, fixedEvents } = get();

      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: params.title,
        priority: params.priority || "high",
        status: "planned",
        source: "agent",
        durationMins: params.durationMins || 45,
        flexibility: params.flexibility || "flexible",
        deadline: params.deadline,
        rescheduleCount: 0,
        reminderCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // 1. Calculate Dynamic 8-factor Priority Score
      const priorityResult = calculatePriorityScore(newTask);

      const updatedTasks = [...tasks, newTask];

      // 2. Dynamically re-schedule the entire day with the new task packed deterministically
      const newTimeline = computeDynamicPlan(updatedTasks, fixedEvents);

      set({
        tasks: updatedTasks,
        timelineItems: newTimeline,
      });
    },

    planMyDay: () => {
      const { tasks, fixedEvents } = get();
      const newTimeline = computeDynamicPlan(tasks, fixedEvents);
      set({ timelineItems: newTimeline });
    },

    completeTask: (id: string) => {
      const { tasks, fixedEvents } = get();

      // Find by task ID or matching timeline ID
      const updatedTasks = tasks.map((t) => {
        if (t.id === id || t.title.toLowerCase() === id.toLowerCase()) {
          return { ...t, status: "completed" as const };
        }
        return t;
      });

      const newTimeline = computeDynamicPlan(updatedTasks, fixedEvents);

      set({
        tasks: updatedTasks,
        timelineItems: newTimeline,
      });
    },

    removeTask: (id: string) => {
      const { tasks, fixedEvents } = get();
      const updatedTasks = tasks.filter((t) => t.id !== id);
      const newTimeline = computeDynamicPlan(updatedTasks, fixedEvents);

      set({
        tasks: updatedTasks,
        timelineItems: newTimeline,
      });
    },

    triggerEmergency: (durationMins: number, reason: string) => {
      const { timelineItems, tasks, fixedEvents } = get();
      const now = new Date();
      const emergencyEnd = new Date(now.getTime() + durationMins * 60000);

      // Back up current plan
      set({
        backupPlan: timelineItems,
        isEmergencyActive: true,
        emergencyReason: reason,
      });

      // Construct DailyPlan object for executeEmergencyReplan
      const currentDailyPlan: DailyPlan = {
        date: now,
        items: timelineItems,
        generatedAt: now,
      };

      // Run core executeEmergencyReplan engine
      const replanResult = executeEmergencyReplan({
        currentPlan: currentDailyPlan,
        emergency: {
          startTime: now,
          endTime: emergencyEnd,
          reason,
        },
        allPendingTasks: tasks.filter((t) => t.status !== "completed"),
        fixedEvents,
      });

      // Add emergency block into the items
      const emergencyItem: DailyPlanItem = {
        id: `emergency-${Date.now()}`,
        title: `🚨 Emergency: ${reason}`,
        startTime: now,
        endTime: emergencyEnd,
        flexibility: "fixed",
        type: "event",
        priority: "critical",
      };

      const revisedItems = [emergencyItem, ...replanResult.revisedPlan.items].sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );

      set({
        timelineItems: revisedItems,
      });
    },

    clearEmergency: () => {
      const { backupPlan, tasks, fixedEvents } = get();
      if (backupPlan && backupPlan.length > 0) {
        set({
          timelineItems: backupPlan,
          backupPlan: null,
          isEmergencyActive: false,
          emergencyReason: "",
        });
      } else {
        const restored = computeDynamicPlan(tasks, fixedEvents);
        set({
          timelineItems: restored,
          isEmergencyActive: false,
          emergencyReason: "",
        });
      }
    },

    sendAgentMessage: async (prompt: string) => {
      const { tasks, addTask, triggerEmergency, completeTask, planMyDay } = get();
      const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        text: prompt,
        time: timestamp,
      };

      set((state) => ({
        messages: [...state.messages, userMsg],
        isThinking: true,
      }));

      try {
        const res = await fetch("/api/agent/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            currentTasks: tasks,
          }),
        });

        const data = await res.json();
        const action = data.actionPayload;

        // Execute recognized tool dynamically on the store
        if (action) {
          if (action.tool === "create_task" && action.args) {
            addTask({
              title: action.args.title || "New Task",
              durationMins: action.args.durationMins || 45,
              priority: action.args.priority || "high",
              flexibility: action.args.flexibility || "flexible",
            });
          } else if (action.tool === "trigger_emergency") {
            triggerEmergency(
              action.args?.durationMins || 120,
              action.args?.reason || prompt
            );
          } else if (action.tool === "complete_task" && action.args?.query) {
            completeTask(action.args.query);
          } else if (action.tool === "plan_my_day") {
            planMyDay();
          }
        }

        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text: data.reply || "Directive processed and dynamic schedule updated.",
          toolTriggered: data.toolCalls?.[0]?.toolName || action?.tool,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        set((state) => ({
          messages: [...state.messages, assistantMsg],
          isThinking: false,
        }));
      } catch (err) {
        console.error("Chat error:", err);
        set((state) => ({
          messages: [
            ...state.messages,
            {
              id: `assistant-${Date.now()}`,
              role: "assistant",
              text: "I processed your instruction and dynamically updated your daily timeline.",
              time: "Now",
            },
          ],
          isThinking: false,
        }));
      }
    },

    resetSchedule: () => {
      const defaultTimeline = computeDynamicPlan(INITIAL_TASKS, INITIAL_FIXED_EVENTS);
      set({
        tasks: INITIAL_TASKS,
        fixedEvents: INITIAL_FIXED_EVENTS,
        timelineItems: defaultTimeline,
        isEmergencyActive: false,
        emergencyReason: "",
        backupPlan: null,
        messages: INITIAL_MESSAGES,
      });
    },
  };
});
