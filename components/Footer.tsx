import type { Profile } from "@/lib/types";

export default function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="mt-auto border-t border-border/70 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-6 text-center text-sm text-foreground/60">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <div className="flex gap-4">
          <a href={`mailto:${profile.email}`} className="hover:text-foreground">
            Email
          </a>
          <a href={profile.github} className="hover:text-foreground" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={profile.linkedin} className="hover:text-foreground" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
