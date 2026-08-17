import "server-only";
import { supabaseAdmin } from "@/lib/supabase";
import type { Project } from "@/lib/types";

type Row = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  status: string;
  status_label: string;
  description: string;
  story: string | null;
  tech: string[];
  highlights: string[];
  images: { src: string; alt: string }[];
  is_public: boolean;
  sort_order: number;
};

function fromRow(r: Row): Project {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    tagline: r.tagline,
    status: r.status as Project["status"],
    statusLabel: r.status_label,
    description: r.description,
    story: r.story,
    tech: r.tech ?? [],
    highlights: r.highlights ?? [],
    images: r.images ?? [],
    isPublic: r.is_public,
    sortOrder: r.sort_order,
  };
}

export async function getPublicProjects(): Promise<Project[]> {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .eq("is_public", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data as Row[]).map(fromRow);
}

export async function getAllProjects(): Promise<Project[]> {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data as Row[]).map(fromRow);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabaseAdmin.from("projects").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data ? fromRow(data as Row) : null;
}

export async function createProject(input: Partial<Row> & { slug: string; title: string }) {
  const { data, error } = await supabaseAdmin.from("projects").insert(input).select().single();
  if (error) throw error;
  return fromRow(data as Row);
}

export async function updateProject(id: string, input: Partial<Row>) {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return fromRow(data as Row);
}

export async function deleteProject(id: string) {
  const { error } = await supabaseAdmin.from("projects").delete().eq("id", id);
  if (error) throw error;
}
