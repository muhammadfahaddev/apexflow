// ============================================================
// ApexFlow — AI Tool Definitions for Intent Router
// Deterministic tools that the AI model can execute directly
// ============================================================

import type { Tool } from "@apexflow/ai-provider";

export const AGENT_TOOLS: Tool[] = [
  {
    name: "create_task",
    description: "Create a new task in the user's task inbox or schedule with priority and deadline.",
    parameters: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Clear and concise title of the task",
        },
        description: {
          type: "string",
          description: "Optional details, notes, or instructions for the task",
        },
        priority: {
          type: "string",
          enum: ["critical", "high", "normal", "low"],
          description: "Priority level of the task",
        },
        durationMins: {
          type: "number",
          description: "Estimated duration in minutes (e.g. 15, 30, 45, 60)",
        },
        deadline: {
          type: "string",
          description: "ISO date-time string if a deadline is specified, e.g. 2026-10-26T17:00:00Z",
        },
        flexibility: {
          type: "string",
          enum: ["fixed", "flexible", "semi_flexible"],
          description: "Whether the task can be shifted automatically during rescheduling",
        },
        category: {
          type: "string",
          description: "Category like Work, Personal, Client, Urgent, Learning",
        },
      },
      required: ["title"],
    },
  },
  {
    name: "plan_my_day",
    description: "Build or display the deterministic daily plan timeline for today or a specific date.",
    parameters: {
      type: "object",
      properties: {
        targetDate: {
          type: "string",
          description: "ISO date string for which to plan, defaults to today",
        },
        focusArea: {
          type: "string",
          description: "Optional theme or focus area, e.g. Deep Work, Meetings, Project Delivery",
        },
      },
    },
  },
  {
    name: "trigger_emergency",
    description: "Activate Emergency Mode to automatically shift flexible tasks and protect fixed commitments.",
    parameters: {
      type: "object",
      properties: {
        durationMins: {
          type: "number",
          description: "How many minutes the user is unavailable (e.g. 60, 120, 180)",
        },
        reason: {
          type: "string",
          description: "Brief reason for emergency or unavailability",
        },
      },
      required: ["durationMins"],
    },
  },
  {
    name: "complete_task",
    description: "Mark a task as completed by title or ID.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The task title or keyword to match and mark done",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_status_summary",
    description: "Get a summary of pending, completed, overdue tasks, and current day accomplishments.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
];
