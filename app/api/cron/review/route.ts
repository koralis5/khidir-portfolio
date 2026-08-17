import { NextRequest, NextResponse } from "next/server";
import { getTickets, updateTicketStatus } from "@/lib/data/tickets";
import { getAllKnowledge, createKnowledge } from "@/lib/data/knowledge";
import { getPublicProjects } from "@/lib/data/projects";
import { proposeKnowledgeUpdates } from "@/lib/anthropic";

export const dynamic = "force-dynamic";

function isAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${process.env.CRON_SECRET}`;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [tickets, knowledge, projects] = await Promise.all([getTickets(), getAllKnowledge(), getPublicProjects()]);
  const openTickets = tickets.filter((t) => t.status === "open");
  const liveKnowledge = knowledge
    .filter((k) => k.status === "live")
    .map((k) => ({ agentScope: k.agentScope, title: k.title, content: k.content }));

  if (openTickets.length === 0) {
    return NextResponse.json({ proposalsCreated: 0, ticketsDrafted: 0, message: "No open tickets to review." });
  }

  const projectsSummary = projects
    .map((p) => `${p.title}: ${p.description} Tech: ${p.tech.join(", ")}. ${p.story ?? ""}`)
    .join("\n");

  const proposals = await proposeKnowledgeUpdates(
    openTickets.map((t) => ({ question: t.question, agent: t.agent })),
    liveKnowledge,
    projectsSummary
  );

  let proposalsCreated = 0;
  let ticketsDrafted = 0;

  for (const proposal of proposals) {
    await createKnowledge({
      agentScope: proposal.agentScope,
      title: proposal.title,
      content: proposal.content,
      status: "pending",
    });
    proposalsCreated++;

    for (const question of proposal.addressesQuestions) {
      const matches = openTickets.filter((t) => t.question === question && t.status === "open");
      for (const match of matches) {
        await updateTicketStatus(match.id, "drafted");
        ticketsDrafted++;
      }
    }
  }

  return NextResponse.json({ proposalsCreated, ticketsDrafted, openTicketsReviewed: openTickets.length });
}
