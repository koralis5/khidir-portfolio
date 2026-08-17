import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/tickets", label: "Tickets" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/knowledge", label: "Knowledge" },
  { href: "/admin/profile", label: "Profile" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <nav className="flex flex-wrap gap-1 text-sm font-medium">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-foreground/80 transition hover:bg-surface-muted hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-surface-muted"
          >
            Log out
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}
