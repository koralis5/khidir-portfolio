import { NextRequest, NextResponse } from "next/server";
import { classifyAgent, getAgentReply, type ChatTurn } from "@/lib/anthropic";
import { getAgentSystemPrompt } from "@/lib/agents";
import { sendTicketEmail } from "@/lib/notify";
import { supabaseAdmin } from "@/lib/supabase";
import type { AgentSlug } from "@/lib/agents";

export const dynamic = "force-dynamic";

const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_TURNS = 10;
const PER_IP_LIMIT = 15;
const PER_IP_WINDOW_MINUTES = 10;
const GLOBAL_DAILY_LIMIT = 300;

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  const sessionId = typeof body?.sessionId === "string" ? body.sessionId : "";
  const requestedAgent = body?.agent as AgentSlug | undefined;
  const clientHistory: ChatTurn[] = Array.isArray(body?.history) ? body.history : [];

  if (!message || !sessionId) {
    return NextResponse.json({ error: "message and sessionId are required" }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  const ip = getClientIp(req);

  const [ipResult, globalResult] = await Promise.all([
    supabaseAdmin
      .from("chats")
      .select("id", { count: "exact", head: true })
      .eq("ip", ip)
      .gte("created_at", new Date(Date.now() - PER_IP_WINDOW_MINUTES * 60_000).toISOString()),
    supabaseAdmin
      .from("chats")
      .select("id", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60_000).toISOString()),
  ]);
  if (ipResult.error) console.error("Rate limit check (per-IP) failed:", ipResult.error.message);
  if (globalResult.error) console.error("Rate limit check (global) failed:", globalResult.error.message);
  const ipCount = ipResult.count;
  const globalCount = globalResult.count;

  if ((ipCount ?? 0) >= PER_IP_LIMIT) {
    return NextResponse.json(
      { error: "You're sending messages too quickly — please wait a bit and try again." },
      { status: 429 }
    );
  }
  if ((globalCount ?? 0) >= GLOBAL_DAILY_LIMIT) {
    return NextResponse.json(
      { error: "The chat has hit its daily limit — please use the contact form instead." },
      { status: 429 }
    );
  }

  const agent: AgentSlug =
    requestedAgent && ["job", "projects", "me"].includes(requestedAgent)
      ? requestedAgent
      : await classifyAgent(message);

  const history = [...clientHistory.slice(-MAX_HISTORY_TURNS), { role: "user" as const, content: message }];
  const systemPrompt = await getAgentSystemPrompt(agent);
  const { reply, needsFollowup } = await getAgentReply(systemPrompt, history);

  const { error: chatLogError } = await supabaseAdmin.from("chats").insert({
    session_id: sessionId,
    ip,
    agent,
    user_message: message,
    assistant_message: reply,
    needs_followup: needsFollowup,
  });
  if (chatLogError) console.error("Failed to log chat:", chatLogError.message);

  if (needsFollowup) {
    const { error: ticketError } = await supabaseAdmin.from("tickets").insert({
      session_id: sessionId,
      agent,
      question: message,
    });
    if (ticketError) console.error("Failed to create ticket:", ticketError.message);

    await sendTicketEmail(agent, message, sessionId).catch((err) =>
      console.error("Failed to send ticket email:", err)
    );
  }

  return NextResponse.json({ reply, agent, needsFollowup });
}
