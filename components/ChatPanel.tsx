"use client";

import { useState } from "react";
import { AGENT_LABELS } from "@/lib/types";
import type { Message } from "@/lib/useChat";

export default function ChatPanel({
  messages,
  send,
  loading,
  error,
  compact = false,
}: {
  messages: Message[];
  send: (text: string) => void;
  loading: boolean;
  error: string | null;
  compact?: boolean;
}) {
  const [input, setInput] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    send(input);
    setInput("");
  }

  return (
    <div className="flex h-full flex-col">
      <div
        className={`flex-1 space-y-3 overflow-y-auto ${compact ? "p-4" : "p-6"}`}
      >
        {messages.length === 0 && (
          <p className="text-sm text-foreground/60">
            Ask me anything — about my projects, my skills, or just to get to know me.
            I&apos;m an AI answering as {compact ? "Khidir" : "him"}, not the real him, so if I can&apos;t
            answer something properly it&apos;ll get flagged for a real follow-up.
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                m.role === "user"
                  ? "bg-gradient-to-r from-brand-blue-deep to-brand-pink-deep text-white"
                  : "card"
              }`}
            >
              {m.role === "assistant" && m.agent && (
                <div className="mb-1 text-xs font-medium text-brand-pink-deep">
                  {AGENT_LABELS[m.agent]}
                </div>
              )}
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}
        {loading && <p className="text-xs text-foreground/50">Typing…</p>}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-border p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          maxLength={1000}
          className="flex-1 rounded-full border border-border bg-surface px-4 py-2 text-sm outline-none focus:border-brand-pink-deep"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-full bg-gradient-to-r from-brand-blue-deep to-brand-pink-deep px-4 py-2 text-sm font-medium text-white transition hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          Send
        </button>
      </form>
    </div>
  );
}
