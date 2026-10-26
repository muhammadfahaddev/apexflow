"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApexFlowStore } from "@/lib/store/useApexFlowStore";

export const ChatWindow: React.FC = () => {
  const { messages, isThinking, isEmergencyActive, sendAgentMessage } = useApexFlowStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSend = async (textToSend?: string) => {
    const userText = (textToSend || input).trim();
    if (!userText || isThinking) return;

    setInput("");
    await sendAgentMessage(userText);
  };

  const quickPrompts = [
    "Plan my day",
    "Add task: Client proposal due 5 PM",
    "I have a 2-hour emergency",
    "Add task: Review PRs 30 mins critical",
  ];

  return (
    <div className="flex flex-col h-full bg-[#0f172a]/70 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-800/80 flex items-center justify-between bg-[#090d16]/70">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="font-semibold text-sm text-slate-100">ApexFlow Executive Chat</h3>
        </div>
        <div className="flex items-center gap-2">
          {isEmergencyActive && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
              🚨 Emergency Mode
            </span>
          )}
          <span className="text-[11px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
            Groq Router Active
          </span>
        </div>
      </div>

      {/* Messages Feed */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                m.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-xs"
                  : "bg-slate-800/90 border border-slate-700/60 text-slate-200 rounded-bl-xs"
              }`}
            >
              {m.text}
              {m.toolTriggered && (
                <div className="mt-2.5 pt-2 border-t border-slate-700/50 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                  <span>⚡ Tool Executed:</span>
                  <span className="bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">
                    {m.toolTriggered}
                  </span>
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1 font-mono">{m.time}</span>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2.5 text-xs text-indigo-400 bg-indigo-950/30 border border-indigo-500/20 px-3.5 py-2 rounded-xl w-fit">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            <span>ApexFlow Reasoning & Dynamic Scheduling...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts Chips */}
      <div className="px-4 py-2 border-t border-slate-800/50 bg-[#090d16]/40 flex gap-2 overflow-x-auto no-scrollbar">
        {quickPrompts.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => handleSend(suggestion)}
            className="text-[11px] whitespace-nowrap bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 text-slate-400 hover:text-indigo-200 px-3 py-1.5 rounded-full transition-all cursor-pointer shadow-sm"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-slate-800/80 bg-[#090d16]/80"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Command your agent (e.g. 'Add task: Review contracts' or 'Plan my day')..."
            className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            type="submit"
            disabled={isThinking || !input.trim()}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-medium text-sm transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};
