import { getProfile } from "@/lib/data/profile";
import { saveProfileAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const profile = await getProfile();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Profile</h1>
      <p className="mt-1 text-sm text-foreground/60">Powers the Home hero, About page, and Contact links.</p>

      <form action={saveProfileAction} className="card mt-6 space-y-4 rounded-3xl p-6">
        <div className="grid grid-cols-2 gap-4">
          <TextField label="Full name" name="name" defaultValue={profile.name} />
          <TextField label="Preferred name" name="preferredName" defaultValue={profile.preferredName} />
        </div>
        <TextField label="Tagline" name="tagline" defaultValue={profile.tagline} />
        <TextField label="School" name="school" defaultValue={profile.school} />
        <TextField label="Looking for" name="lookingFor" defaultValue={profile.lookingFor} />
        <div className="grid grid-cols-3 gap-4">
          <TextField label="Email" name="email" defaultValue={profile.email} />
          <TextField label="GitHub URL" name="github" defaultValue={profile.github} />
          <TextField label="LinkedIn URL" name="linkedin" defaultValue={profile.linkedin} />
        </div>
        <TextArea label="Bio (one paragraph per line)" name="bio" defaultValue={profile.bio.join("\n")} />
        <TextArea
          label="Strengths (one per line)"
          name="strengths"
          defaultValue={profile.strengths.join("\n")}
        />
        <button className="rounded-full bg-gradient-to-r from-brand-blue-deep to-brand-pink-deep px-6 py-2.5 text-sm font-medium text-white">
          Save
        </button>
      </form>
    </div>
  );
}

function TextField({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-full border border-border bg-surface px-4 py-2 text-sm outline-none focus:border-brand-pink-deep"
      />
    </div>
  );
}

function TextArea({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        defaultValue={defaultValue}
        rows={4}
        className="mt-1 w-full rounded-2xl border border-border bg-surface px-4 py-2 text-sm outline-none focus:border-brand-pink-deep"
      />
    </div>
  );
}
