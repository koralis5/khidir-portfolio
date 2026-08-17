export type ProjectStatus = "shipped" | "in-progress" | "completed";

export type ProjectImage = {
  src: string;
  alt: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  status: ProjectStatus;
  statusLabel: string;
  description: string;
  story: string | null;
  tech: string[];
  highlights: string[];
  images: ProjectImage[];
  isPublic: boolean;
  sortOrder: number;
};

export type Profile = {
  name: string;
  preferredName: string;
  tagline: string;
  school: string;
  lookingFor: string;
  email: string;
  github: string;
  linkedin: string;
  bio: string[];
  strengths: string[];
};

export type AgentSlug = "job" | "projects" | "me";

// Client-safe: no server-only imports, so components can use this directly.
export const AGENT_LABELS: Record<AgentSlug, string> = {
  job: "💼 Job Agent",
  projects: "🛠️ Projects Agent",
  me: "😊 Me Agent",
};

export type KnowledgeEntry = {
  id: string;
  agentScope: AgentSlug | "shared";
  title: string;
  content: string;
  status: "live" | "pending";
};

export type Ticket = {
  id: string;
  sessionId: string;
  agent: string;
  question: string;
  status: string;
  createdAt: string;
};
