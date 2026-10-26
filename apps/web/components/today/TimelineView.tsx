"use client";

import React from "react";
import type { DailyPlanItem } from "@apexflow/types";

interface TimelineViewProps {
  items: DailyPlanItem[];
  onCompleteTask?: (id: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ items, onCompleteTask }) => {
  const formatTime = (dateInput: Date | string) => {
    const d = new Date(dateInput);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="relative border-l border-slate-800 ml-4 pl-6 space-y-6">
      {items.map((item, index) => {
        const isFixed = item.flexibility === "fixed";
        const isBreak = item.type === "break";
        const isEmergency = item.title.includes("Emergency");

        return (
          <div key={item.id || index} className="relative group">
            {/* Timeline Dot Anchor */}
            <div
              className={`absolute -left-[31px] top-3 w-4 h-4 rounded-full border-2 bg-[#090d16] transition-transform group-hover:scale-125 ${
                isEmergency
                  ? "border-red-500 bg-red-500"
                  : isFixed
                  ? "border-indigo-400 bg-indigo-500"
                  : isBreak
                  ? "border-amber-400"
                  : "border-slate-500"
              }`}
            />

            {/* Timeline Item Card */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                isEmergency
                  ? "bg-red-500/10 border-red-500/30 text-red-200"
                  : isFixed
                  ? "bg-indigo-950/20 border-indigo-500/30 text-white"
                  : isBreak
                  ? "bg-amber-950/10 border-amber-500/20 text-amber-200/90"
                  : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-200"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-mono font-medium text-slate-400">
                  {formatTime(item.startTime)} – {formatTime(item.endTime)}
                </span>
                <div className="flex items-center gap-1.5">
                  {item.priority && (
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                        item.priority === "critical"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : item.priority === "high"
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {item.priority}
                    </span>
                  )}
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800/60 text-slate-400">
                    {item.flexibility}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm text-slate-100">{item.title}</h4>
                {item.type === "task" && onCompleteTask && (
                  <button
                    onClick={() => onCompleteTask(item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                  >
                    ✓ Mark Done
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
