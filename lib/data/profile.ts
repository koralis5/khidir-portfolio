import "server-only";
import { supabaseAdmin } from "@/lib/supabase";
import type { Profile } from "@/lib/types";

type Row = {
  name: string;
  preferred_name: string;
  tagline: string;
  school: string;
  looking_for: string;
  email: string;
  github: string;
  linkedin: string;
  bio: string[];
  strengths: string[];
};

function fromRow(r: Row): Profile {
  return {
    name: r.name,
    preferredName: r.preferred_name,
    tagline: r.tagline,
    school: r.school,
    lookingFor: r.looking_for,
    email: r.email,
    github: r.github,
    linkedin: r.linkedin,
    bio: r.bio ?? [],
    strengths: r.strengths ?? [],
  };
}

export async function getProfile(): Promise<Profile> {
  const { data, error } = await supabaseAdmin.from("profile").select("*").eq("id", "main").single();
  if (error) throw error;
  return fromRow(data as Row);
}

export async function updateProfile(input: Partial<Row>) {
  const { data, error } = await supabaseAdmin
    .from("profile")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", "main")
    .select()
    .single();
  if (error) throw error;
  return fromRow(data as Row);
}
