import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllProjects } from "@/lib/data/projects";
import ProjectForm from "@/components/admin/ProjectForm";
import {
  saveProjectAction,
  deleteProjectAction,
  uploadProjectImageAction,
  removeProjectImageAction,
} from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projects = await getAllProjects();
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{project.title}</h1>
        <form action={deleteProjectAction.bind(null, project.id)}>
          <button className="rounded-full border border-red-300 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50">
            Delete project
          </button>
        </form>
      </div>

      <ProjectForm project={project} action={saveProjectAction.bind(null, project.id)} />

      <div className="card mt-6 rounded-3xl p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/60">Screenshots</h2>

        {project.images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {project.images.map((img, i) => (
              <div key={img.src} className="overflow-hidden rounded-2xl border border-border">
                <Image src={img.src} alt={img.alt} width={300} height={200} className="w-full object-cover" />
                <form action={removeProjectImageAction.bind(null, project.id, project.slug, i)} className="p-2">
                  <button className="w-full rounded-full border border-border py-1 text-xs font-medium hover:bg-surface-muted">
                    Remove
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}

        <form
          action={uploadProjectImageAction.bind(null, project.id, project.slug)}
          className="mt-4 flex flex-wrap items-end gap-3"
        >
          <div>
            <label className="text-sm font-medium">New screenshot</label>
            <input type="file" name="file" accept="image/*" required className="mt-1 block text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">Alt text</label>
            <input
              type="text"
              name="alt"
              placeholder="What the screenshot shows"
              className="mt-1 rounded-full border border-border bg-surface px-4 py-2 text-sm outline-none focus:border-brand-pink-deep"
            />
          </div>
          <button className="rounded-full bg-gradient-to-r from-brand-blue-deep to-brand-pink-deep px-5 py-2 text-sm font-medium text-white">
            Upload
          </button>
        </form>
      </div>
    </div>
  );
}
