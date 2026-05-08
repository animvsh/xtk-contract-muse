import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/app/connections")({
  component: Connections,
});

type Conn = { id: string; service_id: string; service_name: string; connected: boolean };

const ACCENTS: Record<string, string> = {
  notion: "oklch(0.5 0 0)",
  slack: "oklch(0.7 0.18 320)",
  gmail: "oklch(0.65 0.22 25)",
  drive: "oklch(0.7 0.18 145)",
  linear: "oklch(0.55 0.2 280)",
  github: "oklch(0.5 0 0)",
  hubspot: "oklch(0.7 0.2 35)",
  figma: "oklch(0.7 0.2 25)",
  zoom: "oklch(0.6 0.2 250)",
  stripe: "oklch(0.55 0.2 280)",
  salesforce: "oklch(0.7 0.18 230)",
  jira: "oklch(0.65 0.2 250)",
};

const DEFAULT_SERVICES: Array<{ service_id: string; service_name: string }> = [
  { service_id: "notion", service_name: "Notion" },
  { service_id: "slack", service_name: "Slack" },
  { service_id: "gmail", service_name: "Gmail" },
  { service_id: "drive", service_name: "Google Drive" },
  { service_id: "linear", service_name: "Linear" },
  { service_id: "github", service_name: "GitHub" },
  { service_id: "hubspot", service_name: "HubSpot" },
  { service_id: "figma", service_name: "Figma" },
  { service_id: "zoom", service_name: "Zoom" },
  { service_id: "stripe", service_name: "Stripe" },
  { service_id: "salesforce", service_name: "Salesforce" },
  { service_id: "jira", service_name: "Jira" },
];

function Connections() {
  const [conns, setConns] = useState<Conn[]>([]);

  const load = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user?.id;
    if (!uid) return;
    let { data } = await supabase.from("connections").select("*").eq("user_id", uid).order("service_name");
    if (!data || data.length === 0) {
      await supabase.from("connections").insert(
        DEFAULT_SERVICES.map((s) => ({ ...s, connected: false, user_id: uid })),
      );
      ({ data } = await supabase.from("connections").select("*").eq("user_id", uid).order("service_name"));
    }
    setConns((data as Conn[] | null) ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (c: Conn) => {
    await supabase.from("connections").update({ connected: !c.connected }).eq("id", c.id);
    load();
  };

  const { connected, available } = useMemo(() => {
    return {
      connected: conns.filter((c) => c.connected),
      available: conns.filter((c) => !c.connected),
    };
  }, [conns]);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <PageHeader
        title="Connections"
        subtitle={`${connected.length} of ${conns.length} services connected`}
      />

      {connected.length > 0 && (
        <>
          <SectionLabel>Connected</SectionLabel>
          <Grid items={connected} toggle={toggle} />
        </>
      )}

      <SectionLabel className="mt-10">Available</SectionLabel>
      <Grid items={available} toggle={toggle} />
    </div>
  );
}

function SectionLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mb-3 text-xs uppercase tracking-wider text-muted-foreground ${className}`}>{children}</div>;
}

function Grid({ items, toggle }: { items: Conn[]; toggle: (c: Conn) => void }) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((c) => {
        const accent = ACCENTS[c.service_id] ?? "oklch(0.5 0 0)";
        return (
          <div key={c.id} className="flex items-center gap-3 rounded-xl border border-black/[0.06] bg-white/70 p-3.5 backdrop-blur">
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-sm font-semibold text-foreground">
                {c.service_name[0]}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white" style={{ background: accent }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="truncate text-sm font-medium">{c.service_name}</div>
              <div className="text-[11px] text-muted-foreground">{c.connected ? "Connected" : "Not connected"}</div>
            </div>
            <button
              onClick={() => toggle(c)}
              className={`flex h-7 items-center gap-1 rounded-md px-2.5 text-xs font-medium transition-colors ${
                c.connected
                  ? "bg-primary/10 text-primary"
                  : "bg-primary text-primary-foreground hover:opacity-90"
              }`}
            >
              {c.connected ? <><Check className="h-3 w-3" /> On</> : <><Plus className="h-3 w-3" /> Connect</>}
            </button>
          </div>
        );
      })}
    </div>
  );
}
