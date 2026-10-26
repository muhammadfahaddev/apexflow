"use client";

import React, { useState, useEffect } from "react";
import { TimelineView } from "@/components/today/TimelineView";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { EmergencyButton } from "@/components/shared/EmergencyButton";
import { useApexFlowStore } from "@/lib/store/useApexFlowStore";

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const {
    timelineItems,
    isEmergencyActive,
    emergencyReason,
    triggerEmergency,
    clearEmergency,
    resetSchedule,
  } = useApexFlowStore();

  // Clock ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate dynamic stats directly from store
  const totalTasks = timelineItems.filter((i) => i.type === "task").length;
  const criticalCount = timelineItems.filter((i) => i.priority === "critical").length;
  const totalFocusMins = timelineItems
    .filter((i) => i.type === "task")
    .reduce((acc, item) => {
      const s = new Date(item.startTime).getTime();
      const e = new Date(item.endTime).getTime();
      return acc + (!isNaN(s) && !isNaN(e) ? (e - s) / 60000 : 0);
    }, 0);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Executive Navigation Bar */}
      <header className="border-b border-slate-800/80 px-4 sm:px-6 py-3 flex items-center justify-between bg-[#090d16]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30">
            ▲
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base tracking-tight text-white">ApexFlow</h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v0.1.0 Beta
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              AI Executive Assistant • Zustand Dynamic State
            </p>
          </div>
        </div>

        {/* Center Live Clock & Execution Status */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
          <div className="hidden md:flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <span>📅 Today, Oct 26</span>
            <span className="text-slate-600">•</span>
            <span className="font-mono text-slate-200">{currentTime || "Loading..."}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold">
            {isEmergencyActive ? (
              <span className="flex items-center gap-1.5 text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                Emergency Mode Active
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Deterministic Schedule Active
              </span>
            )}
          </div>
        </div>

        {/* Emergency Mode Trigger & Action Center */}
        <div className="flex items-center gap-3">
          <EmergencyButton
            onTrigger={triggerEmergency}
            isEmergencyActive={isEmergencyActive}
            onClearEmergency={clearEmergency}
          />
        </div>
      </header>

      {/* Emergency Active Alert Ribbon */}
      {isEmergencyActive && (
        <div className="bg-red-500/15 border-b border-red-500/30 px-6 py-2.5 flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs text-red-200 font-medium">
            <span className="text-base">🚨</span>
            <span>
              <strong>Emergency Mode engaged:</strong> {emergencyReason || "User unavailability active"}.
              All flexible tasks have been automatically rescheduled!
            </span>
          </div>
          <button
            onClick={clearEmergency}
            className="text-xs bg-red-600 hover:bg-red-500 text-white font-semibold px-3 py-1 rounded-md shadow transition-colors cursor-pointer"
          >
            End Emergency & Restore
          </button>
        </div>
      )}

      {/* KPI Stats Ribbon */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#0f172a]/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Total Blocks
          </span>
          <span className="text-xl font-bold text-white mt-1">{timelineItems.length}</span>
        </div>

        <div className="bg-[#0f172a]/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Active Tasks
          </span>
          <span className="text-xl font-bold text-indigo-400 mt-1">{totalTasks}</span>
        </div>

        <div className="bg-[#0f172a]/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Critical (P1)
          </span>
          <span className="text-xl font-bold text-red-400 mt-1">{criticalCount}</span>
        </div>

        <div className="bg-[#0f172a]/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Planned Focus
          </span>
          <span className="text-xl font-bold text-emerald-400 mt-1">
            {Math.floor(totalFocusMins / 60)}h {Math.round(totalFocusMins % 60)}m
          </span>
        </div>
      </div>

      {/* Main Split Grid Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Executive Chat (5 Cols) */}
        <div className="lg:col-span-5 h-[calc(100vh-230px)] min-h-[500px] flex flex-col">
          <ChatWindow />
        </div>

        {/* Right Column: Interactive Daily Timeline (7 Cols) */}
        <div className="lg:col-span-7 h-[calc(100vh-230px)] min-h-[500px] flex flex-col bg-[#0f172a]/50 border border-slate-800/80 rounded-2xl p-5 sm:p-6 overflow-y-auto shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Daily Execution Timeline
              </h2>
              <p className="text-xs text-slate-400">
                Deterministic slots protected by ApexFlow 8-factor Priority Engine
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetSchedule}
                className="text-[11px] font-mono text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 hover:border-slate-700 px-2 py-1 rounded transition-colors cursor-pointer"
                title="Reset to default day plan"
              >
                Reset Day
              </button>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                Live Dynamic Sync
              </span>
            </div>
          </div>

          <TimelineView />
        </div>
      </main>
    </div>
  );
}
