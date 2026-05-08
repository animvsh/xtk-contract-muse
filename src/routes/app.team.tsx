import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { toast } from "sonner";

export const Route = createFileRoute("/app/team")({
  component: TeamSpaces,
});

type Space = { id: string; name: string; color: string };

function TeamSpaces() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  const load = async () => {
    const { data } = await supabase.from("team_spaces").select("*").order("created_at");
    setSpaces((data as Space[] | null) ?? []);
    const { data: members } = await supabase.from("space_members").select("space_id");
    const c: Record<string, number> = {};
    ((members as { space_id: string }[] | null) ?? []).forEach((m) => {
      c[m.space_id] = (c[m.space_id] ?? 0) + 1;
    });
    setCounts(c);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!name.trim()) return;
    const colors = ["oklch(0.6 0.2 250)", "oklch(0.7 0.18 35)", "oklch(0.7 0.18 145)", "oklch(0.7 0.2 320)"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const { error } = await supabase.from("team_spaces").insert({ name: name.trim(), color });
    if (error) return toast.error(error.message);
    toast.success("Space created");
    setName("");
    setCreating(false);
    load();
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <PageHeader
        title="Team Spaces"
        subtitle="Shared brains organized by team"
        action={
          <button
            onClick={() => setCreating((v) => !v)}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> New space
          </button>
        }
      />

      {creating && (
        <div className="mb-5 flex gap-2 rounded-xl border border-black/[0.06] bg-white/70 p-3 backdrop-blur">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && create()}
            placeholder="Space name…"
            className="flex-1 rounded-lg border border-black/[0.06] bg-white px-3 py-2 text-sm outline-none focus:border-primary/40"
          />
          <button onClick={create} className="rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90">
            Create
          </button>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {spaces.map((s) => (
          <Link
            key={s.id}
            to="/app/team/$id"
            params={{ id: s.id }}
            className="group rounded-2xl border border-black/[0.06] bg-white/70 p-4 backdrop-blur transition-colors hover:border-primary/30"
          >
            <div className="h-16 rounded-lg" style={{ background: `linear-gradient(135deg, ${s.color}, oklch(0.95 0.04 80))` }} />
            <div className="mt-4 flex items-center justify-between">
              <h3 className="font-medium">{s.name}</h3>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" /> {counts[s.id] ?? 0}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
