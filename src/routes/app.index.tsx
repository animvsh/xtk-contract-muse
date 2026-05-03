import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, Bot, Plug, FileStack, Users, ShieldCheck, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/app/")({
  component: AppHome,
});

function AppHome() {
  const cards = [
    { to: "/app/brain" as const, icon: Brain, title: "Ask the brain", desc: "Search across your connected data and act on it." },
    { to: "/app/agents" as const, icon: Bot, title: "Agents", desc: "Cloud-hosted agents working in the background." },
    { to: "/app/connections" as const, icon: Plug, title: "Connections", desc: "Plug in Notion, Slack, Gmail, and more." },
    { to: "/app/docs" as const, icon: FileStack, title: "Docs", desc: "Your indexed knowledge base." },
    { to: "/app/team" as const, icon: Users, title: "Team Spaces", desc: "Shared workspaces for every team." },
    { to: "/app/approvals" as const, icon: ShieldCheck, title: "Approvals", desc: "Review pending agent actions." },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Welcome back, Animesh</h1>
      <p className="mt-1 text-sm text-muted-foreground">Here's what's happening in your workspace.</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-accent/30"
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-primary">
              <c.icon className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{c.title}</h3>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold">Recent activity</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {[
            ["Agent 'Daily Standup'", "summarized #engineering · 2m ago"],
            ["You", "sent contract to adithya@beevr.io · 14m ago"],
            ["Agent 'Sales Digest'", "synced 23 deals from HubSpot · 1h ago"],
            ["Sarah Chen", "connected Linear · 3h ago"],
          ].map(([who, what], i) => (
            <li key={i} className="flex items-center gap-3 border-b border-border/50 pb-3 last:border-0">
              <div className="h-8 w-8 rounded-full bg-accent" />
              <div><span className="font-medium">{who}</span> <span className="text-muted-foreground">{what}</span></div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
