"use client";

import { useState } from "react";
import { useChat } from "@/lib/useChat";
import ChatPanel from "@/components/ChatPanel";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const chat = useChat();

  return (
    <div className="fixed bottom-6 right-6 z-30">
      {open && (
        <div className="card mb-3 h-[28rem] w-[22rem] max-w-[calc(100vw-3rem)] overflow-hidden rounded-3xl shadow-xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <span className="text-sm font-semibold">Ask me anything</span>
              <p className="text-[11px] text-foreground/50">🤖 AI assistant, not the real Khidir</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-foreground/50 hover:text-foreground"
            >
              ✕
            </button>
          </div>
          <div className="h-[calc(100%-3rem)]">
            <ChatPanel {...chat} compact />
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-brand-blue-deep to-brand-pink-deep text-2xl text-white candy-shadow transition hover:scale-110 hover:rotate-6"
        aria-label="Toggle chat"
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}
