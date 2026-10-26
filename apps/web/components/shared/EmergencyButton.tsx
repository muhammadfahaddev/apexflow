"use client";

import React, { useState } from "react";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrigger: (durationMins: number, reason: string) => void;
}

export const EmergencyButton: React.FC<{
  onTrigger: (durationMins: number, reason: string) => void;
}> = ({ onTrigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [duration, setDuration] = useState(120); // 2 hours default
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onTrigger(duration, reason || "Unexpected event / emergency");
    setIsOpen(false);
    setReason("");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all text-xs font-semibold tracking-wide uppercase shadow-sm"
      >
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        Emergency Mode
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0f172a] border border-slate-700/80 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 text-lg">
                🚨
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Trigger Emergency Mode</h3>
                <p className="text-xs text-slate-400">
                  ApexFlow will automatically reschedule flexible tasks.
                </p>
              </div>
            </div>

            {/* Quick Duration Buttons */}
            <div className="mb-4">
              <label className="text-xs font-medium text-slate-300 block mb-2">
                Unavailable Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[30, 60, 120, 180].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDuration(mins)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                      duration === mins
                        ? "bg-red-500 text-white border-red-400 shadow-md shadow-red-500/20"
                        : "bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div className="mb-6">
              <label className="text-xs font-medium text-slate-300 block mb-2">
                Reason / Note (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Internet is down, urgent client call..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2 text-sm font-medium rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/30 transition-all"
              >
                Rebuild Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
