// ============================================================
// ApexFlow — Mobile Zustand State Store
// Powers Native iOS/Android/Web tabs with 100% Dynamic Engine
// ============================================================

import { create } from "zustand";
import type { Task, DailyPlanItem, DailyPlan } from "@apexflow/types";
import {
  calculatePriorityScore,
  generateDailyPlan,
  executeEmergencyReplan,
  type FixedCommitment,
} from "@apexflow/utils";

export interface MobileChatMessage {
  id: string;
  sender: "user" | "agent";
  text: string;
  time: string;
  toolExecuted?: string;
}

interface MobileState {
  tasks: Task[];
  fixedEvents: FixedCommitment[];
  timelineItems: DailyPlanItem[];
  isEmergencyActive: boolean;
  emergencyReason: string;
  backupPlan: DailyPlanItem[] | null;
  messages: MobileChatMessage[];
  isThinking: boolean;

  // Actions
  addTask: (title: string, durationMins?: number, priority?: "critical" | "high" | "normal" | "low") => void;
  completeTask: (id: string) => void;
  removeTask: (id: string) => void;
  triggerEmergency: (durationMins?: number, reason?: string) => void;
  clearEmergency: () => void;
  sendChatMessage: (text: string) => Promise<void>;
  planMyDay: () => void;
}

const getTodayTime = (hours: number, minutes: number = 0) => {
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
};

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
];

const INITIAL_FIXED_EVENTS: FixedCommitment[] = [
  {
    id: "meeting-1",
    title: "Team Standup & Product Review",
    start: getTodayTime(9, 30),
    end: getTodayTime(10, 15),
    flexibility: "fixed",
    source: "calendar",
  },
];

const computePlan = (tasks: Task[], fixedEvents: FixedCommitment[]): DailyPlanItem[] => {
  const pending = tasks.filter((t) => t.status !== "completed");
  const result = generateDailyPlan(new Date(), pending, fixedEvents, {
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

const INITIAL_MESSAGES: MobileChatMessage[] = [
  {
    id: "m-1",
    sender: "agent",
    text: "Good day, Fahad. I am your mobile executive assistant. Your day is dynamically scheduled. What would you like to execute?",
    time: "Just now",
  },
];

export const useMobileStore = create<MobileState>((set, get) => {
  const initialTimeline = computePlan(INITIAL_TASKS, INITIAL_FIXED_EVENTS);

  return {
    tasks: INITIAL_TASKS,
    fixedEvents: INITIAL_FIXED_EVENTS,
    timelineItems: initialTimeline,
    isEmergencyActive: false,
    emergencyReason: "",
    backupPlan: null,
    messages: INITIAL_MESSAGES,
    isThinking: false,

    addTask: (title, durationMins = 45, priority = "high") => {
      const { tasks, fixedEvents } = get();

      const newTask: Task = {
        id: `task-${Date.now()}`,
        title,
        priority,
        status: "planned",
        source: "agent",
        durationMins,
        flexibility: "flexible",
        rescheduleCount: 0,
        reminderCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      calculatePriorityScore(newTask);
      const updatedTasks = [...tasks, newTask];
      const newTimeline = computePlan(updatedTasks, fixedEvents);

      set({
        tasks: updatedTasks,
        timelineItems: newTimeline,
      });
    },

    completeTask: (id) => {
      const { tasks, fixedEvents } = get();
      const updatedTasks = tasks.map((t) => (t.id === id ? { ...t, status: "completed" as const } : t));
      const newTimeline = computePlan(updatedTasks, fixedEvents);

      set({
        tasks: updatedTasks,
        timelineItems: newTimeline,
      });
    },

    removeTask: (id) => {
      const { tasks, fixedEvents } = get();
      const updatedTasks = tasks.filter((t) => t.id !== id);
      const newTimeline = computePlan(updatedTasks, fixedEvents);

      set({
        tasks: updatedTasks,
        timelineItems: newTimeline,
      });
    },

    planMyDay: () => {
      const { tasks, fixedEvents } = get();
      const newTimeline = computePlan(tasks, fixedEvents);
      set({ timelineItems: newTimeline });
    },

    triggerEmergency: (durationMins = 120, reason = "Mobile 2h Emergency") => {
      const { timelineItems, tasks, fixedEvents } = get();
      const now = new Date();
      const emergencyEnd = new Date(now.getTime() + durationMins * 60000);

      set({
        backupPlan: timelineItems,
        isEmergencyActive: true,
        emergencyReason: reason,
      });

      const currentDailyPlan: DailyPlan = {
        date: now,
        items: timelineItems,
        generatedAt: now,
      };

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

      const emergencyBlock: DailyPlanItem = {
        id: `emergency-${Date.now()}`,
        title: `🚨 Emergency: ${reason}`,
        startTime: now,
        endTime: emergencyEnd,
        flexibility: "fixed",
        type: "event",
        priority: "critical",
      };

      const revised = [emergencyBlock, ...replanResult.revisedPlan.items].sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );

      set({ timelineItems: revised });
    },

    clearEmergency: () => {
      const { backupPlan, tasks, fixedEvents } = get();
      if (backupPlan) {
        set({
          timelineItems: backupPlan,
          backupPlan: null,
          isEmergencyActive: false,
          emergencyReason: "",
        });
      } else {
        const restored = computePlan(tasks, fixedEvents);
        set({
          timelineItems: restored,
          isEmergencyActive: false,
          emergencyReason: "",
        });
      }
    },

    sendChatMessage: async (text) => {
      const { addTask, triggerEmergency, planMyDay, completeTask } = get();
      const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const userMsg: MobileChatMessage = {
        id: `msg-${Date.now()}`,
        sender: "user",
        text,
        time,
      };

      set((state) => ({
        messages: [...state.messages, userMsg],
        isThinking: true,
      }));

      const lower = text.toLowerCase();
      let toolExecuted: string | undefined;
      let reply = "I have processed your command and updated your daily schedule.";

      if (lower.startsWith("add task:") || lower.startsWith("add ") || lower.includes("new task")) {
        const title = text.replace(/^add task:?/i, "").replace(/^add /i, "").trim() || "New Mobile Task";
        addTask(title, 45, lower.includes("critical") ? "critical" : "high");
        toolExecuted = "create_task";
        reply = `Added task "${title}" and scheduled it into your day.`;
      } else if (lower.includes("emergency") || lower.includes("busy")) {
        triggerEmergency(120, "Reported via mobile chat");
        toolExecuted = "trigger_emergency";
        reply = "Emergency mode active. Flexible tasks have been rescheduled past the 2-hour window.";
      } else if (lower.includes("plan my day") || lower.includes("schedule")) {
        planMyDay();
        toolExecuted = "plan_my_day";
        reply = "Your day has been analyzed and locked with deterministic 15-minute buffers.";
      } else if (lower.includes("complete ") || lower.includes("done")) {
        const query = text.replace(/^(?:complete|done)\s*/i, "").trim();
        completeTask(query);
        toolExecuted = "complete_task";
        reply = `Completed task matching "${query}". Schedule recalculated.`;
      }

      set((state) => ({
        messages: [
          ...state.messages,
          {
            id: `agent-${Date.now()}`,
            sender: "agent",
            text: reply,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            toolExecuted,
          },
        ],
        isThinking: false,
      }));
    },
  };
});
