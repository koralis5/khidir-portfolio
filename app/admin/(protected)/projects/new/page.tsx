import ProjectForm from "@/components/admin/ProjectForm";
import { saveProjectAction } from "@/app/admin/actions";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">New project</h1>
      <ProjectForm action={saveProjectAction.bind(null, null)} />
    </div>
  );
}
