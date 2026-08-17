"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import {
  createProject,
  updateProject,
  deleteProject,
  getProjectBySlug,
} from "@/lib/data/projects";
import {
  createKnowledge,
  updateKnowledge,
  deleteKnowledge,
} from "@/lib/data/knowledge";
import { updateProfile } from "@/lib/data/profile";
import { updateStyleGuide } from "@/lib/data/styleGuide";
import { updateTicketStatus } from "@/lib/data/tickets";

function splitLines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function str(value: FormDataEntryValue | null): string {
  return String(value ?? "").trim();
}

// --- Projects ---

export async function saveProjectAction(id: string | null, formData: FormData) {
  const input = {
    slug: str(formData.get("slug")),
    title: str(formData.get("title")),
    tagline: str(formData.get("tagline")),
    status: str(formData.get("status")) || "completed",
    status_label: str(formData.get("statusLabel")),
    description: str(formData.get("description")),
    story: str(formData.get("story")) || null,
    tech: splitLines(formData.get("tech")),
    highlights: splitLines(formData.get("highlights")),
    is_public: formData.get("isPublic") === "on",
    sort_order: Number(formData.get("sortOrder")) || 0,
  };

  if (id) {
    await updateProject(id, input);
  } else {
    await createProject(input);
  }
  redirect("/admin/projects");
}

export async function deleteProjectAction(id: string) {
  await deleteProject(id);
  redirect("/admin/projects");
}

export async function uploadProjectImageAction(projectId: string, slug: string, formData: FormData) {
  const file = formData.get("file") as File | null;
  const alt = str(formData.get("alt")) || "Screenshot";
  if (!file || file.size === 0) return;

  const ext = file.name.split(".").pop() || "png";
  const path = `${slug}/${Date.now()}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from("project-images")
    .upload(path, file, { contentType: file.type });
  if (error) throw error;

  const { data } = supabaseAdmin.storage.from("project-images").getPublicUrl(path);

  const project = await getProjectBySlug(slug);
  const images = [...(project?.images ?? []), { src: data.publicUrl, alt }];
  await updateProject(projectId, { images } as never);

  redirect(`/admin/projects/${projectId}`);
}

export async function removeProjectImageAction(projectId: string, slug: string, index: number) {
  const project = await getProjectBySlug(slug);
  if (!project) return;
  const images = project.images.filter((_, i) => i !== index);
  await updateProject(projectId, { images } as never);
  redirect(`/admin/projects/${projectId}`);
}

// --- Knowledge ---

export async function saveKnowledgeAction(id: string | null, formData: FormData) {
  const input = {
    agentScope: str(formData.get("agentScope")),
    title: str(formData.get("title")),
    content: str(formData.get("content")),
    status: (str(formData.get("status")) || "live") as "live" | "pending",
  };

  if (id) {
    await updateKnowledge(id, input);
  } else {
    await createKnowledge(input);
  }
  redirect("/admin/knowledge");
}

export async function deleteKnowledgeAction(id: string) {
  await deleteKnowledge(id);
  redirect("/admin/knowledge");
}

export async function setKnowledgeStatusAction(id: string, status: "live" | "pending") {
  await updateKnowledge(id, { status });
  redirect("/admin/knowledge");
}

// --- Style guide ---

export async function saveStyleGuideAction(agentScope: string, formData: FormData) {
  await updateStyleGuide(agentScope, str(formData.get("content")));
  redirect("/admin/knowledge");
}

// --- Profile ---

export async function saveProfileAction(formData: FormData) {
  await updateProfile({
    name: str(formData.get("name")),
    preferred_name: str(formData.get("preferredName")),
    tagline: str(formData.get("tagline")),
    school: str(formData.get("school")),
    looking_for: str(formData.get("lookingFor")),
    email: str(formData.get("email")),
    github: str(formData.get("github")),
    linkedin: str(formData.get("linkedin")),
    bio: splitLines(formData.get("bio")),
    strengths: splitLines(formData.get("strengths")),
  });
  redirect("/admin/profile");
}

// --- Tickets ---

export async function setTicketStatusAction(id: string, status: string) {
  await updateTicketStatus(id, status);
  redirect("/admin/tickets");
}

// --- Auth ---

export async function logoutAction() {
  (await cookies()).delete(ADMIN_COOKIE_NAME);
  redirect("/admin/login");
}
