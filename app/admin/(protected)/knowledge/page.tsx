import { getAllKnowledge } from "@/lib/data/knowledge";
import { getAllStyleGuides } from "@/lib/data/styleGuide";
import {
  saveKnowledgeAction,
  deleteKnowledgeAction,
  setKnowledgeStatusAction,
  saveStyleGuideAction,
} from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const AGENT_OPTIONS = ["job", "me", "projects", "shared"];

export default async function AdminKnowledgePage() {
  const [knowledge, styleGuides] = await Promise.all([getAllKnowledge(), getAllStyleGuides()]);
  const pending = knowledge.filter((k) => k.status === "pending");
  const live = knowledge.filter((k) => k.status === "live");

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">Knowledge</h1>
        <p className="mt-1 text-sm text-foreground/60">
          What each chat agent knows. Facts and stories live here; safety rules (confidentiality,
          salary deflection, anti-injection) are hardcoded and not editable from this page.
        </p>
      </div>

      {pending.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-pink-deep">
            Pending approval ({pending.length})
          </h2>
          <div className="mt-3 space-y-3">
            {pending.map((k) => (
              <div key={k.id} className="card rounded-2xl border-2 border-brand-pink/50 p-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-foreground/70">
                    {k.agentScope}
                  </span>
                  <div className="flex gap-2">
                    <form action={setKnowledgeStatusAction.bind(null, k.id, "live")}>
                      <button className="rounded-full bg-gradient-to-r from-brand-blue-deep to-brand-pink-deep px-3 py-1.5 text-xs font-medium text-white">
                        Approve
                      </button>
                    </form>
                    <form action={deleteKnowledgeAction.bind(null, k.id)}>
                      <button className="rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-surface-muted">
                        Reject
                      </button>
                    </form>
                  </div>
                </div>
                <p className="mt-2 font-medium">{k.title}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-foreground/70">{k.content}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/60">
          Live knowledge ({live.length})
        </h2>
        <div className="mt-3 space-y-4">
          {live.map((k) => (
            <form key={k.id} action={saveKnowledgeAction.bind(null, k.id)} className="card rounded-2xl p-5">
              <div className="flex flex-wrap items-center gap-3">
                <select
                  name="agentScope"
                  defaultValue={k.agentScope}
                  className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium outline-none"
                >
                  {AGENT_OPTIONS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
                <input type="hidden" name="status" value="live" />
                <input
                  name="title"
                  defaultValue={k.title}
                  className="flex-1 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium outline-none focus:border-brand-pink-deep"
                />
              </div>
              <textarea
                name="content"
                defaultValue={k.content}
                rows={5}
                className="mt-3 w-full rounded-2xl border border-border bg-surface px-4 py-2 text-sm outline-none focus:border-brand-pink-deep"
              />
              <div className="mt-3 flex gap-2">
                <button className="rounded-full bg-gradient-to-r from-brand-blue-deep to-brand-pink-deep px-4 py-1.5 text-xs font-medium text-white">
                  Save
                </button>
                <button
                  formAction={deleteKnowledgeAction.bind(null, k.id)}
                  className="rounded-full border border-border px-4 py-1.5 text-xs font-medium hover:bg-surface-muted"
                >
                  Delete
                </button>
              </div>
            </form>
          ))}
        </div>

        <form action={saveKnowledgeAction.bind(null, null)} className="card mt-4 rounded-2xl p-5">
          <p className="text-sm font-medium">Add knowledge</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <select
              name="agentScope"
              defaultValue="shared"
              className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium outline-none"
            >
              {AGENT_OPTIONS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            <input type="hidden" name="status" value="live" />
            <input
              name="title"
              placeholder="Title"
              required
              className="flex-1 rounded-full border border-border bg-surface px-3 py-1.5 text-sm outline-none focus:border-brand-pink-deep"
            />
          </div>
          <textarea
            name="content"
            placeholder="Content"
            required
            rows={4}
            className="mt-3 w-full rounded-2xl border border-border bg-surface px-4 py-2 text-sm outline-none focus:border-brand-pink-deep"
          />
          <button className="mt-3 rounded-full bg-gradient-to-r from-brand-blue-deep to-brand-pink-deep px-4 py-1.5 text-xs font-medium text-white">
            Add
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/60">Style guide</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {styleGuides.map((sg) => (
            <form key={sg.agentScope} action={saveStyleGuideAction.bind(null, sg.agentScope)} className="card rounded-2xl p-5">
              <p className="text-sm font-medium capitalize">{sg.agentScope} agent voice</p>
              <textarea
                name="content"
                defaultValue={sg.content}
                rows={6}
                className="mt-2 w-full rounded-2xl border border-border bg-surface px-4 py-2 text-sm outline-none focus:border-brand-pink-deep"
              />
              <button className="mt-3 rounded-full bg-gradient-to-r from-brand-blue-deep to-brand-pink-deep px-4 py-1.5 text-xs font-medium text-white">
                Save
              </button>
            </form>
          ))}
        </div>
      </section>
    </div>
  );
}
