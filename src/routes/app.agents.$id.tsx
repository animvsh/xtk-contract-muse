import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Play, Loader2, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { runAgent } from "@/lib/agents.functions";
import { AgentCanvas } from "@/components/agent-canvas";
import { ReasoningSteps } from "@/components/reasoning-steps";
import { PageHeader } from "@/components/page-header";
import { toast } from "sonner";

export const Route = createFileRoute("/app/agents/$id")({
  component: AgentDetail,
});

type Agent = {
  id: string;
  name: string;
  description: string | null;
  spec: { trigger: { type: string; description: string }; steps: Array<{ title: string; integration: string; action: string }> };
  runs_count: number;
};

type Run = { id: string; log: string; created_at: string };

function AgentDetail() {
  const { id } = Route.useParams();
  const run = useServerFn(runAgent);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [runs, setRuns] = useState<Run[]>([]);
  const [running, setRunning] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const load = async () => {
    const [{ data: a }, { data: r }] = await Promise.all([
      supabase.from("agents").select("*").eq("id", id).single(),
      supabase.from("agent_runs").select("*").eq("agent_id", id).order("created_at", { ascending: false }).limit(10),
    ]);
    if (a) setAgent(a as unknown as Agent);
    if (r) setRuns(r as Run[]);
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleRun = async () => {
    if (!agent || running) return;
    setRunning(true);
    setActiveIndex(0);
    const total = (agent.spec.steps?.length ?? 0) + 1;
    const ticker = setInterval(() => {
      setActiveIndex((i) => (i === undefined ? 0 : Math.min(i + 1, total - 1)));
    }, 700);
    try {
      await run({ data: { agentId: id } });
      clearInterval(ticker);
      setActiveIndex(-1);
      toast.success("Agent run completed");
      await load();
    } catch (e) {
      clearInterval(ticker);
      setActiveIndex(undefined);
      toast.error(e instanceof Error ? e.message : "Run failed");
    } finally {
      setRunning(false);
    }
  };

  if (!agent) {
    return (
      <div className="mx-auto flex w-full max-w-5xl items-center justify-center px-6 py-20 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <Link to="/app/agents" className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3 w-3" /> Agents
      </Link>
      <PageHeader
        title={agent.name}
        subtitle={agent.description ?? undefined}
        action={
          <button
            onClick={handleRun}
            disabled={running}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-40"
          >
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />} Run
          </button>
        }
      />

      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <Activity className="h-3 w-3" /> Workflow
      </div>
      <AgentCanvas trigger={agent.spec.trigger} steps={agent.spec.steps} activeIndex={activeIndex} />

      <div className="mt-10">
        <div className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Recent runs</div>
        {runs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/[0.08] bg-white/40 p-8 text-center text-sm text-muted-foreground">
            No runs yet — hit Run to try it.
          </div>
        ) : (
          <div className="space-y-2">
            {runs.map((r, idx) => (
              <div key={r.id} className="space-y-1.5">
                <div className="px-1 text-[11px] text-muted-foreground">{new Date(r.created_at).toLocaleString()}</div>
                <ReasoningSteps log={r.log} live={idx === 0 && running === false ? false : false} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
