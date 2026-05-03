import { createFileRoute } from "@tanstack/react-router";
import { FileText, Search } from "lucide-react";

export const Route = createFileRoute("/app/docs")({
  component: Docs,
});

const DOCS = [
  { title: "Beevr — Employment & Hiring Policy", source: "Notion", updated: "2d ago" },
  { title: "Q3 Marketing Plan", source: "Notion", updated: "5h ago" },
  { title: "Engineering Onboarding", source: "Notion", updated: "1w ago" },
  { title: "Customer Interview — Acme Corp", source: "Drive", updated: "3d ago" },
  { title: "Pricing Strategy 2026", source: "Drive", updated: "6h ago" },
  { title: "Brand Guidelines", source: "Figma", updated: "2w ago" },
  { title: "Security & Compliance", source: "Notion", updated: "4d ago" },
  { title: "Investor FAQ", source: "Drive", updated: "1d ago" },
];

function Docs() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Docs</h1>
      <p className="mt-1 text-sm text-muted-foreground">All your indexed company knowledge.</p>

      <div className="mt-6 flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input placeholder="Search docs…" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
      </div>

      <div className="mt-6 divide-y divide-border rounded-xl border border-border bg-card">
        {DOCS.map((d) => (
          <button key={d.title} className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-muted/40">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-primary">
              <FileText className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="font-medium">{d.title}</div>
              <div className="text-xs text-muted-foreground">{d.source} · updated {d.updated}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
