import type { Metadata } from "next";
import Link from "next/link";
import { getProfile } from "@/lib/data/profile";

export const metadata: Metadata = {
  title: "Contact — Khidir",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const profile = await getProfile();
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-center">
      <h1 className="font-display text-3xl font-semibold">Get in touch 💌</h1>
      <p className="mt-3 text-foreground/70">
        Reach me directly, or{" "}
        <Link href="/chat" className="font-semibold text-brand-pink-deep hover:underline">
          ask the chat assistant
        </Link>{" "}
        — if it can&apos;t answer something, it&apos;ll flag it for me automatically.
      </p>

      <div className="card candy-shadow mt-10 flex flex-col gap-4 rounded-[2rem] p-8">
        <a
          href={`mailto:${profile.email}`}
          className="rounded-full bg-gradient-to-r from-brand-blue-deep to-brand-pink-deep px-6 py-3 text-sm font-semibold text-white transition hover:scale-105"
        >
          Email {profile.email}
        </a>
        <div className="flex justify-center gap-4 text-sm font-semibold text-brand-pink-deep">
          <a href={profile.github} target="_blank" rel="noreferrer" className="hover:underline">
            GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:underline">
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}
