import { createFileRoute, Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Brain, Users, FileStack, Bot, ShieldCheck, Plug, KeyRound, LogOut, Cloud, Settings, Menu, X, ChevronUp, PanelLeftClose, PanelLeft } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LiveFeed } from "@/components/live-feed";
import { useAuth } from "@/hooks/use-auth";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";
import { useWorkspaces } from "@/hooks/use-workspaces";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

const navItems = [
  { label: "Home", to: "/app/brain" as const, icon: Brain },
  { label: "Agents", to: "/app/agents" as const, icon: Bot },
  { label: "Builds", to: "/app/builds" as const, icon: Cloud },
  { label: "Team Spaces", to: "/app/team" as const, icon: Users },
  { label: "Files", to: "/app/files" as const, icon: FileStack },
  { label: "Connections", to: "/app/connections" as const, icon: Plug },
  { label: "Access Keys", to: "/app/keys" as const, icon: KeyRound },
];

function AppLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isNavigating = useRouterState({ select: (s) => s.isLoading || s.isTransitioning });
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { current: workspace } = useWorkspaces();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("beevr-sidebar-collapsed") === "1";
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("beevr-sidebar-collapsed", collapsed ? "1" : "0");
    }
  }, [collapsed]);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.04_0_0)] text-sm text-white/70">
        Loading…
      </div>
    );
  }

  const displayName = (user.user_metadata?.display_name as string) || user.email?.split("@")[0] || "You";
  const initial = displayName.charAt(0).toUpperCase();

  const renderSidebar = (mini: boolean) => (
    <>
      <Link to="/" className={`mb-4 flex items-center gap-2.5 ${mini ? "justify-center" : ""}`}>
        <div className="grid h-7 w-7 shrink-0 grid-cols-2 gap-0.5">
          <span className="rounded-full bg-[oklch(0.68_0.22_40)]" />
          <span className="rounded-full bg-[oklch(0.68_0.22_40)]" />
          <span className="rounded-full bg-[oklch(0.68_0.22_40)]" />
          <span className="rounded-full bg-[oklch(0.68_0.22_40)]" />
        </div>
        {!mini && <span className="text-lg font-bold tracking-tight">Beevr</span>}
      </Link>
      {!mini && (
        <div className="mb-5">
          <WorkspaceSwitcher />
        </div>
      )}
      {mini && (
        <div
          className="mx-auto mb-5 h-2.5 w-2.5 rounded-full"
          style={{ background: workspace.color }}
          title={workspace.name}
        />
      )}
      <nav className="space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              title={mini ? item.label : undefined}
              className={`flex w-full items-center rounded-xl text-sm transition-colors ${
                mini ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
              } ${
                active
                  ? "bg-[oklch(0.68_0.22_40)] text-white shadow-md shadow-[oklch(0.68_0.22_40)]/30 font-semibold"
                  : "text-[oklch(0.3_0_0)] hover:bg-white/60"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!mini && item.label}
            </Link>
          );
        })}
      </nav>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={`clicky mt-auto flex w-full items-center rounded-2xl border border-black/5 bg-white/60 text-left backdrop-blur transition-colors hover:bg-white/80 ${
              mini ? "justify-center p-2" : "gap-2.5 p-3"
            }`}
            title={mini ? displayName : undefined}
          >
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.7_0.18_50)] to-[oklch(0.6_0.2_30)] text-sm font-semibold text-white">
              {initial}
            </div>
            {!mini && (
              <>
                <div className="min-w-0 flex-1 text-xs">
                  <div className="truncate font-semibold">{displayName}</div>
                  <div className="truncate text-[oklch(0.45_0_0)]">{user.email}</div>
                </div>
                <ChevronUp className="h-4 w-4 shrink-0 text-[oklch(0.45_0_0)]" />
              </>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="text-xs font-semibold">{displayName}</div>
            <div className="truncate text-[10px] font-normal text-muted-foreground">{user.email}</div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => navigate({ to: "/app/settings" })}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => navigate({ to: "/app/approvals" })}>
            <ShieldCheck className="mr-2 h-4 w-4" />
            Approvals
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => signOut().then(() => navigate({ to: "/auth" }))}
            className="text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );

  return (
    <div className="min-h-screen bg-[oklch(0.04_0_0)] p-0 text-foreground md:p-3">
      {/* Orange ambient glow */}
      <div className="pointer-events-none fixed -left-40 top-40 h-[600px] w-[400px] rounded-full bg-[oklch(0.72_0.21_45)] opacity-40 blur-[120px]" />
      <div className="pointer-events-none fixed -right-40 top-80 h-[600px] w-[400px] rounded-full bg-[oklch(0.72_0.21_45)] opacity-40 blur-[120px]" />

      <div className="relative mx-auto flex min-h-screen max-w-[1500px] overflow-hidden bg-gradient-to-b from-white via-[oklch(0.97_0.04_85)] to-[oklch(0.93_0.1_75)] shadow-2xl md:min-h-[calc(100vh-1.5rem)] md:rounded-[24px]">
        <aside
          className={`hidden shrink-0 flex-col bg-transparent p-3 transition-[width] duration-200 ease-out md:flex ${
            collapsed ? "w-[68px]" : "w-60 p-5"
          }`}
        >
          {renderSidebar(collapsed)}
        </aside>

        {/* Mobile drawer */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 md:hidden" onClick={() => setMobileNavOpen(false)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]" />
            <aside
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 top-0 flex h-full w-72 flex-col bg-gradient-to-b from-white via-[oklch(0.97_0.04_85)] to-[oklch(0.95_0.08_75)] p-5 shadow-2xl animate-[slideInLeft_200ms_ease-out]"
            >
              <button
                onClick={() => setMobileNavOpen(false)}
                className="absolute right-3 top-3 rounded-lg p-1.5 text-[oklch(0.4_0_0)] hover:bg-black/5"
              >
                <X className="h-4 w-4" />
              </button>
              {renderSidebar(false)}
            </aside>
          </div>
        )}

        <main className="relative flex flex-1 flex-col overflow-hidden border-black/5 bg-white/40 backdrop-blur-sm md:border-l">
          <div
            className={`pointer-events-none absolute inset-x-0 top-0 z-50 h-0.5 overflow-hidden transition-opacity duration-200 ${isNavigating ? "opacity-100" : "opacity-0"}`}
          >
            <div className="h-full w-1/3 animate-[progress_1s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-[oklch(0.68_0.22_40)] to-transparent" />
          </div>
          <div className="flex items-center gap-2 border-b border-black/5 bg-white/60 px-3 py-3 md:px-6">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="-ml-1 rounded-lg p-1.5 text-[oklch(0.3_0_0)] hover:bg-black/5 md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="hidden -ml-1 rounded-lg p-1.5 text-[oklch(0.4_0_0)] hover:bg-black/5 md:inline-flex"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
            <div className="hidden gap-1.5 md:flex">
              <span className="h-3 w-3 rounded-full bg-[oklch(0.62_0.22_25)]" />
              <span className="h-3 w-3 rounded-full bg-[oklch(0.78_0.16_70)]" />
              <span className="h-3 w-3 rounded-full bg-[oklch(0.72_0.18_145)]" />
            </div>
            <div className="mx-auto flex min-w-0 items-center gap-2 rounded-md border border-black/5 bg-white px-3 py-1 text-xs text-[oklch(0.4_0_0)] md:px-4">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: workspace.color }} />
              <span className="truncate font-medium text-[oklch(0.25_0_0)]">{workspace.name.toLowerCase().replace(/\s+/g, "-")}</span>
              <span className="hidden truncate text-[oklch(0.55_0_0)] sm:inline">.beevr.io{pathname.replace(/^\/app/, "") || "/home"}</span>
            </div>
          </div>
          <div className="flex flex-1 overflow-hidden">
            <div key={pathname} className="flex min-h-0 flex-1 flex-col overflow-hidden animate-[fadeInUp_80ms_ease-out]">
              <Outlet />
            </div>
            <LiveFeed />
          </div>
        </main>
      </div>
    </div>
  );
}
