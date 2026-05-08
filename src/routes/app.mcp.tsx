import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plug, Plus, Check, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { toast } from "sonner";

export const Route = createFileRoute("/app/mcp")({
  component: MCPPage,
});

type Server = { id: string; name: string; url: string; description: string | null; enabled: boolean };

function MCPPage() {
  const [servers, setServers] = useState<Server[]>([]);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");

  const load = async () => {
    const { data } = await supabase.from("mcp_servers").select("*").order("created_at");
    setServers((data as Server[] | null) ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    if (!name.trim() || !url.trim()) return toast.error("Name and URL required");
    const { error } = await supabase.from("mcp_servers").insert({ name, url, description, enabled: true });
    if (error) return toast.error(error.message);
    toast.success("MCP server added");
    setName("");
    setUrl("");
    setDescription("");
    setAdding(false);
    load();
  };

  const toggle = async (s: Server) => {
    await supabase.from("mcp_servers").update({ enabled: !s.enabled }).eq("id", s.id);
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("mcp_servers").delete().eq("id", id);
    load();
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10">
      <PageHeader
        title="Model Context Protocol"
        subtitle="Let people plug in their own data sources for the brain to reason over"
        action={
          <button
            onClick={() => setAdding((v) => !v)}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Add server
          </button>
        }
      />

      {adding && (
        <div className="mb-5 space-y-2 rounded-2xl border border-black/[0.06] bg-white/70 p-4 backdrop-blur">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Server name (e.g. My Notion)"
            className="w-full rounded-lg border border-black/[0.06] bg-white px-3 py-2 text-sm outline-none focus:border-primary/40"
          />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://mcp.example.com"
            className="w-full rounded-lg border border-black/[0.06] bg-white px-3 py-2 text-sm outline-none focus:border-primary/40"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this server expose?"
            className="w-full rounded-lg border border-black/[0.06] bg-white px-3 py-2 text-sm outline-none focus:border-primary/40"
          />
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={() => setAdding(false)} className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted">
              Cancel
            </button>
            <button onClick={add} className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90">
              Add
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {servers.map((s) => (
          <div key={s.id} className="rounded-2xl border border-black/[0.06] bg-white/70 p-4 backdrop-blur">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Plug className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium">{s.name}</div>
                <div className="truncate text-xs text-muted-foreground">{s.url}</div>
                {s.description && <div className="mt-1 text-xs text-muted-foreground">{s.description}</div>}
              </div>
              <button onClick={() => remove(s.id)} className="text-muted-foreground/60 hover:text-foreground">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              onClick={() => toggle(s)}
              className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                s.enabled ? "bg-primary/10 text-primary" : "border border-black/[0.06] text-muted-foreground hover:bg-muted"
              }`}
            >
              {s.enabled ? <><Check className="h-3 w-3" /> Enabled</> : "Disabled"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
