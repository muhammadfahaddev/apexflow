"use client";

import React, { useState, useEffect } from "react";

interface EmergencyButtonProps {
  onTrigger: (durationMins: number, reason: string) => void;
  isEmergencyActive?: boolean;
  onClearEmergency?: () => void;
}

export const EmergencyButton: React.FC<EmergencyButtonProps> = ({
  onTrigger,
  isEmergencyActive = false,
  onClearEmergency,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [duration, setDuration] = useState(120); // 2 hours default
  const [reason, setReason] = useState("");

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleConfirm = () => {
    onTrigger(duration, reason.trim() || "Unexpected disruption / emergency");
    setIsOpen(false);
    setReason("");
  };

  if (isEmergencyActive) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-xs font-semibold animate-pulse shadow-lg shadow-red-500/10">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span>EMERGENCY ACTIVE</span>
        </div>
        {onClearEmergency && (
          <button
            onClick={onClearEmergency}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            Resolve & Restore
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/60 transition-all text-xs font-semibold tracking-wide uppercase shadow-sm cursor-pointer"
      >
        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
        Emergency Mode
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex min-h-screen items-center justify-center p-4 sm:p-6"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-[#0f172a] border border-slate-700/80 rounded-2xl p-6 sm:p-7 shadow-2xl text-left transform transition-all animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 text-xl shadow-inner">
                  🚨
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Trigger Emergency Mode
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    ApexFlow will reschedule flexible tasks and protect critical anchors.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white rounded-lg p-1.5 hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Duration Selector */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-slate-300 block mb-2 uppercase tracking-wider">
                Unavailable Duration
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {[30, 60, 120, 180].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDuration(mins)}
                    className={`py-2.5 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      duration === mins
                        ? "bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30 ring-2 ring-red-500/30"
                        : "bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600 hover:bg-slate-800"
                    }`}
                  >
                    {mins >= 60 ? `${mins / 60} Hour${mins > 60 ? "s" : ""}` : `${mins} Mins`}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason Input */}
            <div className="mb-6">
              <label className="text-xs font-semibold text-slate-300 block mb-2 uppercase tracking-wider">
                Reason / Note (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Internet is down, urgent client call, family emergency..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleConfirm();
                }}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                autoFocus
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2.5 text-sm font-medium rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/80 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 py-2.5 text-sm font-semibold rounded-xl bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>⚡ Rebuild Schedule</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
