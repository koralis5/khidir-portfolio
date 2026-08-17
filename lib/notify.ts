import "server-only";
import { Resend } from "resend";
import { AGENT_LABELS, type AgentSlug } from "@/lib/agents";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendTicketEmail(agent: AgentSlug, question: string, sessionId: string) {
  const to = process.env.TICKET_NOTIFY_EMAIL;
  if (!to) return;

  await resend.emails.send({
    from: "Portfolio Bot <onboarding@resend.dev>",
    to,
    subject: `New portfolio ticket — ${AGENT_LABELS[agent]}`,
    text: `A visitor asked something the ${agent} agent couldn't answer:\n\n"${question}"\n\nSession: ${sessionId}`,
  });
}
