"use client";

import React, { useState } from "react";
import { useApexFlowStore } from "@/lib/store/useApexFlowStore";
import type { DailyPlanItem } from "@apexflow/types";

export const TimelineView: React.FC = () => {
  const { timelineItems, completeTask, addTask, removeTask } = useApexFlowStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDuration, setNewDuration] = useState(45);
  const [newPriority, setNewPriority] = useState<"critical" | "high" | "normal" | "low">("high");
  const [newFlexibility, setNewFlexibility] = useState<"fixed" | "flexible">("flexible");

  const formatTime = (dateInput: Date | string) => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "--:--";
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getDurationText = (start: Date | string, end: Date | string) => {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    if (isNaN(s) || isNaN(e) || e <= s) return "";
    const mins = Math.round((e - s) / 60000);
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      const rem = mins % 60;
      return rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`;
    }
    return `${mins}m`;
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTask({
      title: newTitle.trim(),
      durationMins: Number(newDuration),
      priority: newPriority,
      flexibility: newFlexibility,
    });
    setNewTitle("");
    setShowAddForm(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top action row */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Execution Queue
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60">
            {timelineItems.length} Blocks
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all cursor-pointer"
        >
          <span>{showAddForm ? "✕ Close" : "➕ Add Task"}</span>
        </button>
      </div>

      {/* Inline Quick Add Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateTask}
          className="mb-6 p-4 rounded-xl bg-slate-900/90 border border-indigo-500/30 shadow-lg space-y-3 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Create New Priority Task
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">
              Zustand + Priority Engine Placed
            </span>
          </div>

          <input
            type="text"
            placeholder="Task title (e.g. Finish Q3 Investor Deck)..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            autoFocus
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Duration</label>
              <select
                value={newDuration}
                onChange={(e) => setNewDuration(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes</option>
                <option value={60}>1 Hour</option>
                <option value={90}>1.5 Hours</option>
                <option value={120}>2 Hours</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Priority</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="critical">Critical (P1)</option>
                <option value="high">High (P2)</option>
                <option value="normal">Normal (P3)</option>
                <option value="low">Low (P4)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Flexibility</label>
              <select
                value={newFlexibility}
                onChange={(e) => setNewFlexibility(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="flexible">Flexible (Can shift)</option>
                <option value="fixed">Fixed (Locked anchor)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newTitle.trim()}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              Add to Schedule
            </button>
          </div>
        </form>
      )}

      {/* Timeline items list */}
      {timelineItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
          <span className="text-3xl mb-2">🎉</span>
          <p className="text-sm font-medium text-slate-300">All Scheduled Tasks Executed!</p>
          <p className="text-xs text-slate-500 mt-1">
            Your schedule is clear. Ask the agent or click "Add Task" to schedule more.
          </p>
        </div>
      ) : (
        <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-4">
          {timelineItems.map((item, index) => {
            const isFixed = item.flexibility === "fixed";
            const isBreak = item.type === "break";
            const isEmergency = item.title.includes("Emergency");
            const durationBadge = getDurationText(item.startTime, item.endTime);

            return (
              <div key={item.id || index} className="relative group">
                {/* Timeline Dot Anchor */}
                <div
                  className={`absolute -left-[33px] top-4 w-4 h-4 rounded-full border-2 bg-[#090d16] transition-transform group-hover:scale-125 z-10 ${
                    isEmergency
                      ? "border-red-500 bg-red-500 ring-4 ring-red-500/20 animate-pulse"
                      : isFixed
                      ? "border-indigo-400 bg-indigo-500"
                      : isBreak
                      ? "border-amber-400 bg-amber-500/30"
                      : "border-slate-500 bg-slate-800"
                  }`}
                />

                {/* Timeline Item Card */}
                <div
                  className={`p-4 rounded-xl border transition-all shadow-sm ${
                    isEmergency
                      ? "bg-red-500/10 border-red-500/40 text-red-100 ring-1 ring-red-500/20"
                      : isFixed
                      ? "bg-indigo-950/20 border-indigo-500/30 text-white"
                      : isBreak
                      ? "bg-amber-950/10 border-amber-500/20 text-amber-200/90"
                      : "bg-[#0f172a]/80 border-slate-800/80 hover:border-slate-700 text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-medium text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                        {formatTime(item.startTime)} – {formatTime(item.endTime)}
                      </span>
                      {durationBadge && (
                        <span className="text-[10px] font-mono text-slate-400">
                          ({durationBadge})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.priority && (
                        <span
                          className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                            item.priority === "critical"
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : item.priority === "high"
                              ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                              : item.priority === "normal"
                              ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {item.priority}
                        </span>
                      )}

                      <span
                        className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border ${
                          isFixed
                            ? "bg-indigo-950/40 text-indigo-300 border-indigo-500/30"
                            : "bg-slate-800/60 text-slate-400 border-slate-700/50"
                        }`}
                      >
                        {item.flexibility === "fixed" ? "🔒 Fixed" : "⚡ Flexible"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <h4
                      className={`font-medium text-sm ${
                        isEmergency ? "text-red-200 font-semibold" : "text-slate-100"
                      }`}
                    >
                      {item.title}
                    </h4>

                    <div className="flex items-center gap-2">
                      {item.type === "task" && (
                        <button
                          type="button"
                          onClick={() => completeTask(item.id)}
                          className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer flex items-center gap-1"
                          title="Mark task done"
                        >
                          <span>✓</span>
                          <span className="hidden sm:inline">Done</span>
                        </button>
                      )}

                      {!isEmergency && (
                        <button
                          type="button"
                          onClick={() => removeTask(item.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity p-1 text-xs cursor-pointer"
                          title="Remove block"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
