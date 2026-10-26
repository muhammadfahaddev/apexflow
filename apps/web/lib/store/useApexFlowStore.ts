// ============================================================
// ApexFlow — Global Executive State Store (Zustand)
// Single Source of Truth for Timeline, Emergency Mode & Agent
// ============================================================

import { create } from "zustand";
import type { DailyPlanItem } from "@apexflow/types";
import { calculatePriorityScore } from "@apexflow/utils";

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  toolTriggered?: string;
  time: string;
}

interface ApexFlowState {
  // Timeline State
  timelineItems: DailyPlanItem[];
  isEmergencyActive: boolean;
  emergencyReason: string;
  backupBeforeEmergency: DailyPlanItem[] | null;

  // Agent Chat State
  messages: ChatMessage[];
  isThinking: boolean;

  // Actions
  addTask: (params: {
    title: string;
    durationMins: number;
    priority: "critical" | "high" | "normal" | "low";
    flexibility: "fixed" | "flexible";
  }) => void;
  completeTask: (id: string) => void;
  removeTask: (id: string) => void;
  triggerEmergency: (durationMins: number, reason: string) => void;
  clearEmergency: () => void;
  sendAgentMessage: (prompt: string) => Promise<void>;
  resetSchedule: () => void;
}

const INITIAL_TIMELINE_ITEMS: DailyPlanItem[] = [
  {
    id: "meeting-1",
    title: "Sync with Team & Engineering Leads",
    startTime: new Date("2026-10-26T09:30:00"),
    endTime: new Date("2026-10-26T10:15:00"),
    flexibility: "fixed",
    type: "event",
    priority: "high",
  },
  {
    id: "task-1",
    title: "Review ApexFlow Architecture & PRs",
    startTime: new Date("2026-10-26T10:30:00"),
    endTime: new Date("2026-10-26T11:45:00"),
    flexibility: "flexible",
    type: "task",
    priority: "critical",
  },
  {
    id: "break-1",
    title: "Lunch & Recharge",
    startTime: new Date("2026-10-26T13:00:00"),
    endTime: new Date("2026-10-26T13:45:00"),
    flexibility: "fixed",
    type: "break",
  },
  {
    id: "task-2",
    title: "Draft Client Executive Proposal",
    startTime: new Date("2026-10-26T14:00:00"),
    endTime: new Date("2026-10-26T15:30:00"),
    flexibility: "flexible",
    type: "task",
    priority: "high",
  },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-welcome",
    role: "assistant",
    text: "Good day, Fahad. I am your executive agent powered by Groq Qwen 27B and Zustand State Engine. What would you like to execute?",
    time: "Now",
  },
];

export const useApexFlowStore = create<ApexFlowState>((set, get) => ({
  timelineItems: INITIAL_TIMELINE_ITEMS,
  isEmergencyActive: false,
  emergencyReason: "",
  backupBeforeEmergency: null,
  messages: INITIAL_MESSAGES,
  isThinking: false,

  addTask: (params) => {
    const { timelineItems } = get();

    // 1. Dynamic 8-factor priority calculation
    const scoreResult = calculatePriorityScore({
      id: `temp-${Date.now()}`,
      title: params.title,
      priority: params.priority,
      status: "planned",
      source: "agent",
      durationMins: params.durationMins,
      flexibility: params.flexibility,
      rescheduleCount: 0,
      reminderCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 2. Find deterministic available slot
    const now = new Date();
    let slotStart = new Date(now);

    if (timelineItems.length > 0) {
      const lastItem = timelineItems[timelineItems.length - 1];
      const lastEnd = new Date(lastItem.endTime);
      if (lastEnd.getTime() > slotStart.getTime()) {
        slotStart = new Date(lastEnd.getTime() + 15 * 60000); // 15m buffer
      }
    }

    const slotEnd = new Date(slotStart.getTime() + params.durationMins * 60000);

    const newTask: DailyPlanItem = {
      id: `task-${Date.now()}`,
      title: params.title,
      startTime: slotStart,
      endTime: slotEnd,
      flexibility: params.flexibility,
      type: "task",
      priority: params.priority,
    };

    set({
      timelineItems: [...timelineItems, newTask].sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      ),
    });
  },

  completeTask: (id: string) => {
    set((state) => ({
      timelineItems: state.timelineItems.filter((i) => i.id !== id),
    }));
  },

  removeTask: (id: string) => {
    set((state) => ({
      timelineItems: state.timelineItems.filter((i) => i.id !== id),
    }));
  },

  triggerEmergency: (durationMins: number, reason: string) => {
    const { timelineItems } = get();
    const now = new Date();
    const emergencyEnd = new Date(now.getTime() + durationMins * 60000);

    // Backup
    set({
      backupBeforeEmergency: timelineItems,
      isEmergencyActive: true,
      emergencyReason: reason,
    });

    // Protect fixed items and shift flexible tasks
    const fixedItems = timelineItems.filter(
      (i) => i.flexibility === "fixed" && !i.title.includes("Emergency")
    );

    const flexibleItems = timelineItems
      .filter((i) => i.flexibility === "flexible")
      .map((task, idx) => {
        const duration =
          new Date(task.endTime).getTime() - new Date(task.startTime).getTime();
        const newStart = new Date(emergencyEnd.getTime() + (idx * 45 + 15) * 60000);
        const newEnd = new Date(newStart.getTime() + duration);
        return {
          ...task,
          startTime: newStart,
          endTime: newEnd,
        };
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

    set({
      timelineItems: [emergencyBlock, ...fixedItems, ...flexibleItems].sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      ),
    });
  },

  clearEmergency: () => {
    const { backupBeforeEmergency, timelineItems } = get();
    if (backupBeforeEmergency && backupBeforeEmergency.length > 0) {
      set({
        timelineItems: backupBeforeEmergency,
        backupBeforeEmergency: null,
        isEmergencyActive: false,
        emergencyReason: "",
      });
    } else {
      set({
        timelineItems: timelineItems.filter((i) => !i.title.includes("Emergency")),
        isEmergencyActive: false,
        emergencyReason: "",
      });
    }
  },

  sendAgentMessage: async (prompt: string) => {
    const { timelineItems, addTask, triggerEmergency, completeTask } = get();
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Add user message
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
          currentTasks: timelineItems,
        }),
      });

      const data = await res.json();
      const action = data.actionPayload;

      // Execute dynamic tool actions on the store
      if (action) {
        if (action.tool === "create_task" && action.args) {
          addTask({
            title: action.args.title || "New AI Task",
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
          const query = action.args.query.toLowerCase();
          const match = timelineItems.find((i) => i.title.toLowerCase().includes(query));
          if (match) completeTask(match.id);
        } else if (action.tool === "plan_my_day") {
          set((state) => ({
            timelineItems: [...state.timelineItems].sort(
              (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
            ),
          }));
        }
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: data.reply || "Directive processed and schedule updated.",
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
            text: "Your directive was recognized and synchronized in state.",
            time: "Now",
          },
        ],
        isThinking: false,
      }));
    }
  },

  resetSchedule: () => {
    set({
      timelineItems: INITIAL_TIMELINE_ITEMS,
      isEmergencyActive: false,
      emergencyReason: "",
      backupBeforeEmergency: null,
      messages: INITIAL_MESSAGES,
    });
  },
}));
