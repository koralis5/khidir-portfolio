import type { Metadata } from "next";
import { getProfile } from "@/lib/data/profile";

export const metadata: Metadata = {
  title: "About — Khidir",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const profile = await getProfile();
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold">About me 🌸</h1>
      <p className="mt-2 text-foreground/70">{profile.school}</p>

      <div className="mt-8 space-y-4 leading-relaxed text-foreground/80">
        {profile.bio.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-brand-blue-deep">
          Strengths
        </h2>
        <ul className="grid gap-3 sm:grid-cols-3">
          {profile.strengths.map((s) => (
            <li key={s} className="card rounded-2xl p-4 text-sm text-foreground/80">
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
