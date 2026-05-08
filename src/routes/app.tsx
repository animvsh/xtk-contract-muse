import { createFileRoute, Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Brain, Home, Users, FileStack, Bot, ShieldCheck, Plug, Network, LogOut } from "lucide-react";
import { LiveFeed } from "@/components/live-feed";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

const navItems = [
  { label: "Home", to: "/app" as const, icon: Home, exact: true },
  { label: "Brain", to: "/app/brain" as const, icon: Brain },
  { label: "Agents", to: "/app/agents" as const, icon: Bot },
  { label: "Team Spaces", to: "/app/team" as const, icon: Users },
  { label: "Docs", to: "/app/docs" as const, icon: FileStack },
  { label: "Connections", to: "/app/connections" as const, icon: Plug },
  { label: "MCP", to: "/app/mcp" as const, icon: Network },
  { label: "Approvals", to: "/app/approvals" as const, icon: ShieldCheck },
];

function AppLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-[oklch(0.04_0_0)] p-3 text-foreground">
      {/* Orange ambient glow */}
      <div className="pointer-events-none fixed -left-40 top-40 h-[600px] w-[400px] rounded-full bg-[oklch(0.72_0.21_45)] opacity-40 blur-[120px]" />
      <div className="pointer-events-none fixed -right-40 top-80 h-[600px] w-[400px] rounded-full bg-[oklch(0.72_0.21_45)] opacity-40 blur-[120px]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1500px] overflow-hidden rounded-[24px] bg-gradient-to-b from-white via-[oklch(0.97_0.04_85)] to-[oklch(0.93_0.1_75)] shadow-2xl">
        <aside className="hidden w-60 shrink-0 flex-col bg-transparent p-5 md:flex">
          <Link to="/" className="mb-8 flex items-center gap-2.5">
            <div className="grid h-7 w-7 grid-cols-2 gap-0.5">
              <span className="rounded-full bg-[oklch(0.68_0.22_40)]" />
              <span className="rounded-full bg-[oklch(0.68_0.22_40)]" />
              <span className="rounded-full bg-[oklch(0.68_0.22_40)]" />
              <span className="rounded-full bg-[oklch(0.68_0.22_40)]" />
            </div>
            <span className="text-lg font-bold tracking-tight">Beevr</span>
          </Link>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(item.to + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    active
                      ? "bg-[oklch(0.68_0.22_40)] text-white shadow-md shadow-[oklch(0.68_0.22_40)]/30 font-semibold"
                      : "text-[oklch(0.3_0_0)] hover:bg-white/60"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-2xl border border-black/5 bg-white/60 p-3 backdrop-blur">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.7_0.18_50)] to-[oklch(0.6_0.2_30)] text-sm font-semibold text-white">
                {initial}
              </div>
              <div className="min-w-0 flex-1 text-xs">
                <div className="truncate font-semibold">{displayName}</div>
                <div className="truncate text-[oklch(0.45_0_0)]">{user.email}</div>
              </div>
              <button
                onClick={() => signOut().then(() => navigate({ to: "/auth" }))}
                className="rounded-lg p-1.5 text-[oklch(0.4_0_0)] hover:bg-black/5"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>

        </aside>

        <main className="flex flex-1 flex-col overflow-hidden border-l border-black/5 bg-white/40 backdrop-blur-sm">
          <div className="flex items-center gap-2 border-b border-black/5 bg-white/60 px-6 py-3">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[oklch(0.62_0.22_25)]" />
              <span className="h-3 w-3 rounded-full bg-[oklch(0.78_0.16_70)]" />
              <span className="h-3 w-3 rounded-full bg-[oklch(0.72_0.18_145)]" />
            </div>
            <div className="mx-auto rounded-md border border-black/5 bg-white px-4 py-1 text-xs text-[oklch(0.4_0_0)]">
              app.beevr.io{pathname.replace(/^\/app/, "") || "/home"}
            </div>
          </div>
          <div className="flex flex-1 overflow-hidden">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <Outlet />
            </div>
            <LiveFeed />
          </div>
        </main>
      </div>
    </div>
  );
}
