import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/data/projects";

export const dynamic = "force-dynamic";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project || !project.isPublic) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/projects" className="text-sm font-medium text-brand-pink-deep hover:underline">
        ← All projects
      </Link>

      <span className="mt-6 block w-fit rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-foreground/70">
        {project.statusLabel}
      </span>
      <h1 className="font-display mt-3 text-3xl font-semibold">{project.title}</h1>
      <p className="mt-2 text-lg text-foreground/70">{project.tagline}</p>

      <p className="mt-8 leading-relaxed text-foreground/80">{project.description}</p>

      {project.story && (
        <div className="card mt-6 rounded-2xl p-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-pink-deep">
            The interesting part
          </h2>
          <p className="leading-relaxed text-foreground/80">{project.story}</p>
        </div>
      )}

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground/60">
          Tech
        </h2>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-full border border-border px-3 py-1 text-sm text-foreground/70"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground/60">
          Highlights
        </h2>
        <ul className="list-inside list-disc space-y-1.5 text-foreground/80">
          {project.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </div>

      {project.images.length > 0 && (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {project.images.map((img) => (
            <div key={img.src} className="card overflow-hidden rounded-2xl">
              <Image
                src={img.src}
                alt={img.alt}
                width={800}
                height={500}
                className="w-full object-cover"
              />
              <p className="p-3 text-xs text-foreground/60">{img.alt}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
