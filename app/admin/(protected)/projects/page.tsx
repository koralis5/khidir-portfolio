import Link from "next/link";
import { getAllProjects } from "@/lib/data/projects";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="rounded-full bg-gradient-to-r from-brand-blue-deep to-brand-pink-deep px-4 py-2 text-sm font-medium text-white"
        >
          New project
        </Link>
      </div>
      <div className="mt-6 space-y-3">
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/admin/projects/${p.id}`}
            className="card flex items-center justify-between rounded-2xl p-5 transition hover:-translate-y-0.5"
          >
            <div>
              <p className="font-medium">{p.title}</p>
              <p className="text-sm text-foreground/60">{p.tagline}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                p.isPublic ? "bg-brand-blue/40 text-brand-blue-deep" : "bg-surface-muted text-foreground/60"
              }`}
            >
              {p.isPublic ? "Public" : "Hidden"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
