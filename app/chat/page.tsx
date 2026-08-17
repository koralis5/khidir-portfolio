"use client";

import { useChat } from "@/lib/useChat";
import ChatPanel from "@/components/ChatPanel";

export default function ChatPage() {
  const chat = useChat();

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-2xl flex-col px-6 py-10">
      <div className="mb-4">
        <h1 className="font-display text-2xl font-semibold">Ask me anything 💬</h1>
        <p className="text-xs text-foreground/50">🤖 AI assistant answering as Khidir, not the real him</p>
      </div>
      <div className="card flex-1 overflow-hidden rounded-3xl">
        <ChatPanel {...chat} />
      </div>
    </div>
  );
}
