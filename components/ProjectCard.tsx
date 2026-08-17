import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/types";

// Two-hue system: blue = steady/done, pink = actively in motion.
const statusStyles: Record<Project["status"], string> = {
  shipped: "bg-brand-blue/40 text-brand-blue-deep",
  "in-progress": "bg-brand-pink/40 text-brand-pink-deep",
  completed: "bg-brand-blue/40 text-brand-blue-deep",
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="card group flex flex-col overflow-hidden rounded-[2rem] transition hover:-translate-y-1.5 hover:scale-[1.01] hover:candy-shadow"
    >
      {project.images[0] ? (
        <div className="relative h-40 w-full overflow-hidden bg-surface-muted">
          <Image
            src={project.images[0].src}
            alt={project.images[0].alt}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="h-40 w-full bg-gradient-to-br from-brand-blue/60 to-brand-pink/60" />
      )}
      <div className="flex flex-1 flex-col gap-3 p-6">
        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${statusStyles[project.status]}`}
        >
          {project.statusLabel}
        </span>
        <h3 className="text-lg font-semibold">{project.title}</h3>
        <p className="text-sm text-foreground/70">{project.tagline}</p>
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {project.tech.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full border border-border px-2.5 py-1 text-xs text-foreground/60"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
