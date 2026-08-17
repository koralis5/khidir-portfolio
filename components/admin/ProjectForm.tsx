import type { Project } from "@/lib/types";

export default function ProjectForm({
  project,
  action,
}: {
  project?: Project;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="card mt-6 space-y-4 rounded-3xl p-6">
      <Field label="Slug (URL path, no spaces)" name="slug" defaultValue={project?.slug} required />
      <Field label="Title" name="title" defaultValue={project?.title} required />
      <Field label="Tagline" name="tagline" defaultValue={project?.tagline} required />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Status</label>
          <select
            name="status"
            defaultValue={project?.status ?? "completed"}
            className="mt-1 w-full rounded-full border border-border bg-surface px-4 py-2 text-sm outline-none focus:border-brand-pink-deep"
          >
            <option value="shipped">Shipped</option>
            <option value="in-progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <Field label="Status label (shown on the card)" name="statusLabel" defaultValue={project?.statusLabel} required />
      </div>

      <TextArea label="Description" name="description" defaultValue={project?.description} required />
      <TextArea
        label="Story (optional — 'the interesting part')"
        name="story"
        defaultValue={project?.story ?? ""}
      />
      <TextArea
        label="Tech (one per line)"
        name="tech"
        defaultValue={project?.tech.join("\n")}
      />
      <TextArea
        label="Highlights (one per line)"
        name="highlights"
        defaultValue={project?.highlights.join("\n")}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 pt-6">
          <input
            id="isPublic"
            name="isPublic"
            type="checkbox"
            defaultChecked={project?.isPublic ?? true}
            className="h-4 w-4"
          />
          <label htmlFor="isPublic" className="text-sm font-medium">
            Public (shown on the site)
          </label>
        </div>
        <Field
          label="Sort order (lower = earlier)"
          name="sortOrder"
          type="number"
          defaultValue={String(project?.sortOrder ?? 0)}
        />
      </div>

      <button
        type="submit"
        className="rounded-full bg-gradient-to-r from-brand-blue-deep to-brand-pink-deep px-6 py-2.5 text-sm font-medium text-white"
      >
        Save
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="mt-1 w-full rounded-full border border-border bg-surface px-4 py-2 text-sm outline-none focus:border-brand-pink-deep"
      />
    </div>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        defaultValue={defaultValue}
        required={required}
        rows={4}
        className="mt-1 w-full rounded-2xl border border-border bg-surface px-4 py-2 text-sm outline-none focus:border-brand-pink-deep"
      />
    </div>
  );
}
