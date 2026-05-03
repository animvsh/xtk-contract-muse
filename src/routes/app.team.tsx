import { createFileRoute } from "@tanstack/react-router";
import { Users, Plus } from "lucide-react";

export const Route = createFileRoute("/app/team")({
  component: TeamSpaces,
});

const SPACES = [
  { name: "Engineering", members: 24, color: "oklch(0.6 0.2 250)" },
  { name: "Product", members: 12, color: "oklch(0.7 0.18 35)" },
  { name: "Sales", members: 18, color: "oklch(0.7 0.18 145)" },
  { name: "People & Ops", members: 6, color: "oklch(0.7 0.2 320)" },
  { name: "Marketing", members: 9, color: "oklch(0.65 0.22 25)" },
  { name: "Leadership", members: 5, color: "oklch(0.78 0.16 70)" },
];

function TeamSpaces() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Spaces</h1>
          <p className="mt-1 text-sm text-muted-foreground">Shared brains organized by team.</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Plus className="h-4 w-4" /> New space
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SPACES.map((s) => (
          <div key={s.name} className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40">
            <div className="h-20 rounded-lg" style={{ background: `linear-gradient(135deg, ${s.color}, oklch(0.25 0.02 60))` }} />
            <h3 className="mt-4 font-semibold">{s.name}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="h-3 w-3" /> {s.members} members
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
