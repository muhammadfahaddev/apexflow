// ============================================================
// ApexFlow — Plugin SDK
// Implement this interface to create an ApexFlow integration.
// ============================================================

import type { Task, AgentMemory, DailyPlan } from "@apexflow/types";

export interface PluginCommand {
  /** Regex pattern to match natural language commands */
  pattern: RegExp;
  description: string;
  handler: (context: PluginCommandContext) => Promise<PluginCommandResult>;
}

export interface PluginCommandContext {
  rawInput: string;
  matches: RegExpMatchArray;
  userId: string;
}

export interface PluginCommandResult {
  message: string;
  data?: unknown;
}

export interface PluginSettingsField {
  key: string;
  label: string;
  type: "text" | "password" | "number" | "boolean" | "select";
  required?: boolean;
  options?: { label: string; value: string }[];
  description?: string;
}

/**
 * Main plugin interface.
 * All ApexFlow integrations (community or official) implement this.
 *
 * @example
 * export const TelegramPlugin: ApexPlugin = {
 *   name: "telegram",
 *   version: "1.0.0",
 *   description: "Send ApexFlow notifications via Telegram",
 *   onTaskCreated: async (task) => { ... },
 * };
 */
export interface ApexPlugin {
  /** Unique plugin identifier (lowercase, hyphenated) */
  name: string;

  /** Semver version */
  version: string;

  /** Short description shown in the UI */
  description: string;

  /** Plugin author */
  author?: string;

  /** Link to plugin repository or documentation */
  url?: string;

  // ── Lifecycle Hooks ────────────────────────────────────────

  /** Called when the plugin is first installed */
  onInstall?(): Promise<void>;

  /** Called when the plugin is uninstalled */
  onUninstall?(): Promise<void>;

  // ── Event Hooks ────────────────────────────────────────────

  /** Called when a new task is created */
  onTaskCreated?(task: Task): Promise<void>;

  /** Called when a task is completed */
  onTaskCompleted?(task: Task): Promise<void>;

  /** Called when emergency mode is activated */
  onEmergencyMode?(durationMins: number): Promise<void>;

  /** Called when daily plan is generated */
  onDayStarted?(plan: DailyPlan): Promise<void>;

  /** Called at end of day with summary */
  onDayEnded?(summary: {
    planned: number;
    completed: number;
    delayed: number;
    skipped: number;
  }): Promise<void>;

  // ── Natural Language Commands ──────────────────────────────

  /**
   * Custom commands this plugin handles.
   * The agent will route matching inputs to the plugin.
   */
  commands?: PluginCommand[];

  // ── Settings ───────────────────────────────────────────────

  /**
   * Settings fields shown in the Settings → Integrations UI.
   */
  settingsSchema?: PluginSettingsField[];

  /**
   * Validate settings provided by user.
   * Return error message or null if valid.
   */
  validateSettings?(settings: Record<string, unknown>): Promise<string | null>;
}

// ── Plugin Registry ──────────────────────────────────────────

const registeredPlugins = new Map<string, ApexPlugin>();

export function registerPlugin(plugin: ApexPlugin): void {
  if (registeredPlugins.has(plugin.name)) {
    console.warn(`Plugin "${plugin.name}" is already registered. Skipping.`);
    return;
  }
  registeredPlugins.set(plugin.name, plugin);
}

export function getPlugin(name: string): ApexPlugin | undefined {
  return registeredPlugins.get(name);
}

export function getAllPlugins(): ApexPlugin[] {
  return Array.from(registeredPlugins.values());
}
