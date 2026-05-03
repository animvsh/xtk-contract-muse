import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Plus } from "lucide-react";

export const Route = createFileRoute("/app/connections")({
  component: Connections,
});

const ALL = [
  { id: "notion", name: "Notion", desc: "Docs, wikis, projects", color: "oklch(0.95 0 0)" },
  { id: "slack", name: "Slack", desc: "Team chat & channels", color: "oklch(0.7 0.18 320)" },
  { id: "gmail", name: "Gmail", desc: "Email & contacts", color: "oklch(0.65 0.22 25)" },
  { id: "drive", name: "Google Drive", desc: "Files & folders", color: "oklch(0.7 0.18 145)" },
  { id: "linear", name: "Linear", desc: "Issues & projects", color: "oklch(0.6 0.2 280)" },
  { id: "github", name: "GitHub", desc: "Code & PRs", color: "oklch(0.95 0 0)" },
  { id: "hubspot", name: "HubSpot", desc: "CRM & deals", color: "oklch(0.7 0.2 35)" },
  { id: "figma", name: "Figma", desc: "Designs & files", color: "oklch(0.7 0.2 25)" },
  { id: "zoom", name: "Zoom", desc: "Meeting transcripts", color: "oklch(0.6 0.2 250)" },
  { id: "stripe", name: "Stripe", desc: "Payments & invoices", color: "oklch(0.7 0.18 280)" },
  { id: "salesforce", name: "Salesforce", desc: "Enterprise CRM", color: "oklch(0.7 0.18 230)" },
  { id: "jira", name: "Jira", desc: "Tickets & sprints", color: "oklch(0.65 0.2 250)" },
];

function Connections() {
  const [connected, setConnected] = useState<Set<string>>(new Set(["notion", "slack", "gmail", "drive"]));

  const toggle = (id: string) => {
    setConnected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Connections</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {connected.size} of {ALL.length} services connected to your workspace.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ALL.map((c) => {
          const isOn = connected.has(c.id);
          return (
            <div key={c.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-background"
                  style={{ backgroundColor: c.color }}
                >
                  {c.name[0]}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">{c.desc}</p>
                </div>
              </div>
              <button
                onClick={() => toggle(c.id)}
                className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isOn
                    ? "border border-primary/40 bg-accent text-primary"
                    : "bg-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                {isOn ? (<><Check className="h-4 w-4" /> Connected</>) : (<><Plus className="h-4 w-4" /> Connect</>)}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
