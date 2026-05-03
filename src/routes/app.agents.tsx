import { createFileRoute } from "@tanstack/react-router";
import { Bot, Plus, Activity } from "lucide-react";

export const Route = createFileRoute("/app/agents")({
  component: Agents,
});

const AGENTS = [
  { name: "Daily Standup Summarizer", desc: "Summarizes #engineering at 9am every weekday.", runs: 142, status: "active" },
  { name: "Sales Digest", desc: "Pulls HubSpot deal updates and posts to #sales.", runs: 89, status: "active" },
  { name: "Inbox Triage", desc: "Sorts and labels Gmail using your routing rules.", runs: 1204, status: "active" },
  { name: "Contract Sender", desc: "Drafts employment contracts from the Beevr template.", runs: 7, status: "active" },
  { name: "Customer Health Watch", desc: "Flags accounts with low usage in the last 14 days.", runs: 31, status: "paused" },
];

function Agents() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agents</h1>
          <p className="mt-1 text-sm text-muted-foreground">Cloud-hosted agents acting on your behalf.</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Plus className="h-4 w-4" /> New agent
        </button>
      </div>

      <div className="mt-8 space-y-3">
        {AGENTS.map((a) => (
          <div key={a.name} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
              <Bot className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{a.name}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${
                  a.status === "active" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                }`}>{a.status}</span>
              </div>
              <p className="text-sm text-muted-foreground">{a.desc}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Activity className="h-3 w-3" /> {a.runs} runs
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
