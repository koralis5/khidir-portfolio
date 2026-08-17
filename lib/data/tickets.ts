import "server-only";
import { supabaseAdmin } from "@/lib/supabase";
import type { Ticket } from "@/lib/types";

export async function getTickets(): Promise<Ticket[]> {
  const { data, error } = await supabaseAdmin
    .from("tickets")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    sessionId: r.session_id,
    agent: r.agent,
    question: r.question,
    status: r.status,
    createdAt: r.created_at,
  }));
}

export async function updateTicketStatus(id: string, status: string) {
  const { error } = await supabaseAdmin.from("tickets").update({ status }).eq("id", id);
  if (error) throw error;
}
