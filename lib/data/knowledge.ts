import "server-only";
import { supabaseAdmin } from "@/lib/supabase";
import type { AgentSlug, KnowledgeEntry } from "@/lib/types";

type Row = {
  id: string;
  agent_scope: string;
  title: string;
  content: string;
  status: string;
};

function fromRow(r: Row): KnowledgeEntry {
  return {
    id: r.id,
    agentScope: r.agent_scope as KnowledgeEntry["agentScope"],
    title: r.title,
    content: r.content,
    status: r.status as KnowledgeEntry["status"],
  };
}

export async function getLiveKnowledge(agent: AgentSlug): Promise<KnowledgeEntry[]> {
  const { data, error } = await supabaseAdmin
    .from("knowledge")
    .select("*")
    .in("agent_scope", [agent, "shared"])
    .eq("status", "live")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data as Row[]).map(fromRow);
}

export async function getAllKnowledge(): Promise<KnowledgeEntry[]> {
  const { data, error } = await supabaseAdmin
    .from("knowledge")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as Row[]).map(fromRow);
}

export async function createKnowledge(input: {
  agentScope: string;
  title: string;
  content: string;
  status?: "live" | "pending";
}) {
  const { data, error } = await supabaseAdmin
    .from("knowledge")
    .insert({
      agent_scope: input.agentScope,
      title: input.title,
      content: input.content,
      status: input.status ?? "live",
    })
    .select()
    .single();
  if (error) throw error;
  return fromRow(data as Row);
}

export async function updateKnowledge(
  id: string,
  input: Partial<{ title: string; content: string; status: "live" | "pending"; agentScope: string }>
) {
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.title !== undefined) patch.title = input.title;
  if (input.content !== undefined) patch.content = input.content;
  if (input.status !== undefined) patch.status = input.status;
  if (input.agentScope !== undefined) patch.agent_scope = input.agentScope;

  const { data, error } = await supabaseAdmin.from("knowledge").update(patch).eq("id", id).select().single();
  if (error) throw error;
  return fromRow(data as Row);
}

export async function deleteKnowledge(id: string) {
  const { error } = await supabaseAdmin.from("knowledge").delete().eq("id", id);
  if (error) throw error;
}
