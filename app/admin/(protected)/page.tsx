import Link from "next/link";
import { getTickets } from "@/lib/data/tickets";
import { getAllKnowledge } from "@/lib/data/knowledge";
import { getAllProjects } from "@/lib/data/projects";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [tickets, knowledge, projects] = await Promise.all([
    getTickets(),
    getAllKnowledge(),
    getAllProjects(),
  ]);

  const openTickets = tickets.filter((t) => t.status === "open").length;
  const pendingKnowledge = knowledge.filter((k) => k.status === "pending").length;

  const stats = [
    { label: "Open tickets", value: openTickets, href: "/admin/tickets" },
    { label: "Pending approvals", value: pendingKnowledge, href: "/admin/knowledge" },
    { label: "Projects", value: projects.length, href: "/admin/projects" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card rounded-2xl p-6 transition hover:-translate-y-0.5">
            <p className="text-3xl font-semibold">{s.value}</p>
            <p className="mt-1 text-sm text-foreground/60">{s.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
