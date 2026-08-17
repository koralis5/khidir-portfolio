import "server-only";
import { supabaseAdmin } from "@/lib/supabase";

export async function getStyleGuide(agentScope: "job" | "me"): Promise<string> {
  const { data, error } = await supabaseAdmin
    .from("style_guide")
    .select("content")
    .eq("agent_scope", agentScope)
    .maybeSingle();
  if (error) throw error;
  return data?.content ?? "";
}

export async function getAllStyleGuides(): Promise<{ agentScope: string; content: string }[]> {
  const { data, error } = await supabaseAdmin.from("style_guide").select("agent_scope, content");
  if (error) throw error;
  return (data ?? []).map((r) => ({ agentScope: r.agent_scope, content: r.content }));
}

export async function updateStyleGuide(agentScope: string, content: string) {
  const { data, error } = await supabaseAdmin
    .from("style_guide")
    .upsert({ agent_scope: agentScope, content, updated_at: new Date().toISOString() })
    .select()
    .single();
  if (error) throw error;
  return data;
}
