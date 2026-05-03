import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Brain, Home, Users, FileStack, Bot, ShieldCheck, Plug } from "lucide-react";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

const navItems = [
  { label: "Home", to: "/app" as const, icon: Home, exact: true },
  { label: "Brain", to: "/app/brain" as const, icon: Brain },
  { label: "Team Spaces", to: "/app/team" as const, icon: Users },
  { label: "Docs", to: "/app/docs" as const, icon: FileStack },
  { label: "Agents", to: "/app/agents" as const, icon: Bot },
  { label: "Connections", to: "/app/connections" as const, icon: Plug },
  { label: "Approvals", to: "/app/approvals" as const, icon: ShieldCheck },
];

function AppLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar p-4 md:block">
        <Link to="/" className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Brain className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold">Acme Inc</span>
        </Link>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex flex-1 flex-col">
        <div className="flex items-center gap-2 border-b border-border px-6 py-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[oklch(0.62_0.22_25)]" />
            <span className="h-3 w-3 rounded-full bg-[oklch(0.78_0.16_70)]" />
            <span className="h-3 w-3 rounded-full bg-[oklch(0.72_0.18_145)]" />
          </div>
          <div className="mx-auto rounded-md bg-muted px-4 py-1 text-xs text-muted-foreground">
            app.beevr.io{pathname.replace(/^\/app/, "") || "/home"}
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
