import { getTickets } from "@/lib/data/tickets";
import { setTicketStatusAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

// Pink = needs you. Light blue = AI already drafted something. Solid blue = done.
const STATUS_STYLES: Record<string, string> = {
  open: "bg-brand-pink/50 text-brand-pink-deep",
  drafted: "bg-brand-blue/25 text-brand-blue-deep",
  resolved: "bg-brand-blue/50 text-brand-blue-deep",
};

export default async function AdminTicketsPage() {
  const tickets = await getTickets();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Tickets</h1>
      <p className="mt-1 text-sm text-foreground/60">
        Questions the chat couldn&apos;t answer, newest first. &quot;Drafted&quot; means the nightly
        review already proposed a knowledge entry for it — check the Knowledge page.
      </p>
      <div className="mt-6 space-y-3">
        {tickets.length === 0 && <p className="text-sm text-foreground/60">No tickets yet.</p>}
        {tickets.map((t) => (
          <div key={t.id} className="card rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-foreground/70">
                  {t.agent}
                </span>
                <span
                  className={`ml-2 rounded-full px-2.5 py-1 text-xs font-medium ${
                    STATUS_STYLES[t.status] ?? "bg-surface-muted text-foreground/70"
                  }`}
                >
                  {t.status}
                </span>
                <p className="mt-2 text-sm text-foreground/90">{t.question}</p>
                <p className="mt-1 text-xs text-foreground/50">
                  {new Date(t.createdAt).toLocaleString()}
                </p>
              </div>
              {t.status !== "resolved" ? (
                <form action={setTicketStatusAction.bind(null, t.id, "resolved")}>
                  <button className="rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-surface-muted">
                    Mark resolved
                  </button>
                </form>
              ) : (
                <form action={setTicketStatusAction.bind(null, t.id, "open")}>
                  <button className="rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-surface-muted">
                    Reopen
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
