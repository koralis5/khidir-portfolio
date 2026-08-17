"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AgentSlug } from "@/lib/types";

export type Message = {
  role: "user" | "assistant";
  content: string;
  agent?: AgentSlug;
};

const SESSION_KEY = "portfolio_chat_session_id";

function getSessionId() {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionIdRef = useRef("");

  useEffect(() => {
    sessionIdRef.current = getSessionId();
  }, []);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      setError(null);
      setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
      setLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: trimmed,
            sessionId: sessionIdRef.current,
            history: messages.map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error || "Something went wrong. Please try again.");
        }

        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply, agent: data.agent },
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [messages, loading]
  );

  return { messages, send, loading, error };
}
