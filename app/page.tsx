import Link from "next/link";
import { getProfile } from "@/lib/data/profile";
import { getPublicProjects } from "@/lib/data/projects";
import ProjectCard from "@/components/ProjectCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [profile, projects] = await Promise.all([getProfile(), getPublicProjects()]);
  const featured = projects.slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl px-6">
      <section className="flex flex-col items-center gap-6 py-24 text-center">
        <span className="candy-shadow rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-foreground/70">
          ✨ {profile.lookingFor}
        </span>
        <h1 className="font-display text-5xl font-semibold tracking-tight sm:text-6xl">
          Hi, I&apos;m{" "}
          <span className="bg-gradient-to-r from-brand-blue-deep to-brand-pink-deep bg-clip-text text-transparent">
            {profile.preferredName}
          </span>
          !
        </h1>
        <p className="max-w-xl text-lg text-foreground/70">{profile.tagline}</p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/projects"
            className="candy-shadow rounded-full bg-gradient-to-r from-brand-blue-deep to-brand-pink-deep px-6 py-3 text-sm font-semibold text-white transition hover:scale-105"
          >
            See my projects
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold transition hover:bg-surface-muted"
          >
            Get in touch
          </Link>
        </div>
      </section>

      <section className="pb-24">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold">Featured projects</h2>
          <Link href="/projects" className="text-sm font-semibold text-brand-pink-deep hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
