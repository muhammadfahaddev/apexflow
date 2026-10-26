"use client";

import React, { useState } from "react";

interface Message {
  role: "assistant" | "user";
  text: string;
  toolTriggered?: string;
  time?: string;
}

interface ChatWindowProps {
  onSendMessage: (msg: string) => Promise<{ reply: string; toolCalls?: any[] }>;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ onSendMessage }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Good day, Fahad. I am your executive agent. Your schedule is optimized, and priority tasks are lined up. What would you like to execute?",
      time: "Now",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userText, time: "Just now" }]);
    setLoading(true);

    try {
      const res = await onSendMessage(userText);
      const toolName = res.toolCalls?.[0]?.toolName;
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: res.reply || "Action processed successfully.",
          toolTriggered: toolName,
          time: "Just now",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Encountered a slight delay communicating with router. Please try again.",
          time: "Just now",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a]/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="font-semibold text-sm text-slate-200">ApexFlow Executive Chat</h3>
        </div>
        <span className="text-[11px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">
          Ultra-Fast Groq Router
        </span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
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
                <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                  <span>⚡ Executed:</span>
                  <span className="bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    {m.toolTriggered}
                  </span>
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1">{m.time}</span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
            <span>ApexFlow is reasoning...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts Chips */}
      <div className="px-4 py-2 border-t border-slate-800/50 flex gap-2 overflow-x-auto no-scrollbar">
        {["Plan my day", "Add task: Client proposal due 5 PM", "I have a 2-hour emergency"].map(
          (suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                setInput(suggestion);
              }}
              className="text-[11px] whitespace-nowrap bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 px-3 py-1 rounded-full transition-colors"
            >
              {suggestion}
            </button>
          )
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-800/80 bg-[#090d16]/70">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Command your agent (e.g., 'Plan my day' or 'Add urgent task')..."
            className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-sm transition-all shadow-md shadow-indigo-600/20"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};
