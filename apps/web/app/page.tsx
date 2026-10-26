"use client";

import React, { useState } from "react";
import { TimelineView } from "@/components/today/TimelineView";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { EmergencyButton } from "@/components/shared/EmergencyButton";
import type { DailyPlanItem } from "@apexflow/types";

export default function DashboardPage() {
  // Mock initial demo items (Deterministic sample)
  const [timelineItems, setTimelineItems] = useState<DailyPlanItem[]>([
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
  ]);

  const [activeMode, setActiveMode] = useState<"normal" | "focus" | "emergency">("normal");

  // Handle emergency button click
  const handleTriggerEmergency = (durationMins: number, reason: string) => {
    setActiveMode("emergency");
    const now = new Date();
    const emergencyEnd = new Date(now.getTime() + durationMins * 60000);

    // Filter and rebuild timeline with emergency block
    setTimelineItems((prev) => {
      const remainingFlexible = prev
        .filter((i) => i.flexibility === "flexible")
        .map((task, idx) => ({
          ...task,
          startTime: new Date(emergencyEnd.getTime() + (idx * 60 + 15) * 60000),
          endTime: new Date(emergencyEnd.getTime() + (idx * 60 + 60) * 60000),
        }));

      const fixedItems = prev.filter((i) => i.flexibility === "fixed");

      const emergencyBlock: DailyPlanItem = {
        id: `emergency-${Date.now()}`,
        title: `🚨 Emergency: ${reason}`,
        startTime: now,
        endTime: emergencyEnd,
        flexibility: "fixed",
        type: "event",
        priority: "critical",
      };

      return [emergencyBlock, ...fixedItems, ...remainingFlexible].sort(
        (a, b) => a.startTime.getTime() - b.startTime.getTime()
      );
    });
  };

  // Handle natural language agent chat messages
  const handleAgentMessage = async (msg: string) => {
    // If prompt contains emergency, trigger emergency directly
    if (msg.toLowerCase().includes("emergency") || msg.toLowerCase().includes("busy")) {
      handleTriggerEmergency(120, "User reported emergency via chat");
      return {
        reply: "Emergency mode engaged. I have isolated your unavailable window and shifted flexible tasks to later hours.",
        toolCalls: [{ toolName: "trigger_emergency", args: { durationMins: 120 } }],
      };
    }

    if (msg.toLowerCase().includes("plan") || msg.toLowerCase().includes("schedule")) {
      return {
        reply: "Your day is structured around 1 core meeting and 2 high-priority execution blocks.",
        toolCalls: [{ toolName: "plan_my_day", args: {} }],
      };
    }

    return {
      reply: `Understood: "${msg}". I have tracked this instruction and updated the context.`,
      toolCalls: [],
    };
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between bg-[#090d16]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-600/30">
            ▲
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-2">
              ApexFlow
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v0.1.0 Beta
              </span>
            </h1>
          </div>
        </div>

        {/* Center Date & Status */}
        <div className="hidden md:flex items-center gap-3 text-xs font-medium text-slate-400">
          <span>📅 Today: Monday, Oct 26</span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active Schedule
          </span>
        </div>

        {/* Emergency Trigger & Action Center */}
        <div className="flex items-center gap-3">
          <EmergencyButton onTrigger={handleTriggerEmergency} />
        </div>
      </header>

      {/* Main Split Grid Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Executive Chat (5 Cols) */}
        <div className="lg:col-span-5 h-[calc(100vh-120px)] flex flex-col">
          <ChatWindow onSendMessage={handleAgentMessage} />
        </div>

        {/* Right Column: Interactive Daily Timeline (7 Cols) */}
        <div className="lg:col-span-7 h-[calc(100vh-120px)] flex flex-col bg-[#0f172a]/40 border border-slate-800/80 rounded-2xl p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80">
            <div>
              <h2 className="text-lg font-bold text-white">Daily Execution Timeline</h2>
              <p className="text-xs text-slate-400">
                Deterministic slots protected by ApexFlow Scheduler
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60">
                {timelineItems.length} Blocks
              </span>
            </div>
          </div>

          <TimelineView
            items={timelineItems}
            onCompleteTask={(id) => {
              setTimelineItems((prev) => prev.filter((i) => i.id !== id));
            }}
          />
        </div>
      </main>
    </div>
  );
}
