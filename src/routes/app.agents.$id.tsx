import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
// removed useServerFn — runs are mocked client-side
import {
  ArrowLeft,
  Play,
  Loader2,
  Activity,
  Plus,
  Trash2,
  MessageSquare,
  ListTree,
  Send,
  Calendar,
  Webhook,
  Zap,
  MousePointerClick,
  Bot,
  Check,
  Sparkles,
  X,
  Save,
  GitBranch,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ReasoningSteps } from "@/components/reasoning-steps";
import { PageHeader } from "@/components/page-header";
import { toast } from "sonner";

export const Route = createFileRoute("/app/agents/$id")({
  component: AgentDetail,
});

type AgentStep = { title: string; integration: string; action: string };
type AgentTrigger = { type: string; description: string };
type AgentSpec = { trigger: AgentTrigger; steps: AgentStep[] };
type Agent = {
  id: string;
  name: string;
  description: string | null;
  spec: AgentSpec;
  runs_count: number;
};
type Run = { id: string; log: string; created_at: string };

const INTEGRATIONS = ["Notion", "Slack", "Gmail", "Drive", "Linear", "GitHub", "HubSpot", "Stripe", "Zoom", "Figma"];
const TRIGGER_TYPES = ["manual", "schedule", "webhook", "event"] as const;

const triggerIcon = (type: string) => {
  if (type === "schedule") return Calendar;
  if (type === "webhook") return Webhook;
  if (type === "event") return Zap;
  return MousePointerClick;
};

function AgentDetail() {
  const { id } = Route.useParams();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [runs, setRuns] = useState<Run[]>([]);
  const [running, setRunning] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const [tab, setTab] = useState<"logs" | "chat">("logs");
  const [editing, setEditing] = useState<{ kind: "trigger" } | { kind: "step"; index: number } | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [{ data: a }, { data: r }] = await Promise.all([
      supabase.from("agents").select("*").eq("id", id).single(),
      supabase.from("agent_runs").select("*").eq("agent_id", id).order("created_at", { ascending: false }).limit(10),
    ]);
    if (a) setAgent(normalizeAgent(a as unknown as Agent));
    const real = (r as Run[] | null) ?? [];
    if (real.length === 0 && a) setRuns(buildMockRuns(normalizeAgent(a as unknown as Agent)));
    else setRuns(real);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const persistSpec = async (nextSpec: AgentSpec, nextName?: string, nextDescription?: string | null) => {
    if (!agent) return;
    const optimistic: Agent = {
      ...agent,
      spec: nextSpec,
      ...(nextName !== undefined ? { name: nextName } : {}),
      ...(nextDescription !== undefined ? { description: nextDescription } : {}),
    };
    setAgent(optimistic);
    setSaving(true);
    const update: { spec: AgentSpec; name?: string; description?: string | null } = { spec: nextSpec };
    if (nextName !== undefined) update.name = nextName;
    if (nextDescription !== undefined) update.description = nextDescription;
    const { error } = await supabase.from("agents").update(update as never).eq("id", id);
    setSaving(false);
    if (error) {
      toast.error("Couldn't save changes");
      load();
    }
  };

  const handleRun = async () => {
    if (!agent || running) return;
    setRunning(true);
    setTab("logs");
    const allSteps = agent.spec.steps ?? [];
    const trig = agent.spec.trigger ?? { type: "manual", description: "Run on demand" };
    const startedAt = new Date().toISOString();
    const runId = `live-${Date.now()}`;
    const lines: string[] = [];
    const summary = `Live run · ${trig.type ?? "manual"} trigger`;
    const pushLog = () => {
      setRuns((cur) => {
        const next = cur.filter((r) => r.id !== runId);
        return [{ id: runId, created_at: startedAt, log: `${summary}\n\n${lines.join("\n")}` }, ...next];
      });
    };

    setActiveIndex(0);
    lines.push(`• [${new Date().toLocaleTimeString()}] Trigger fired — ${trig.description || trig.type || "manual run"}`);
    pushLog();
    await new Promise((r) => setTimeout(r, 600));

    for (let i = 0; i < allSteps.length; i++) {
      setActiveIndex(i + 1);
      const s = allSteps[i];
      lines.push(`• [${new Date().toLocaleTimeString()}] → ${s.integration}: ${s.title}`);
      pushLog();
      await new Promise((r) => setTimeout(r, 500 + Math.random() * 400));
      lines.push(`    ↳ ${s.action} · 200 OK`);
      pushLog();
      await new Promise((r) => setTimeout(r, 250));
    }

    setActiveIndex(-1);
    lines.push(`• [${new Date().toLocaleTimeString()}] Completed in ${(allSteps.length * 0.8 + 0.6).toFixed(1)}s`);
    pushLog();

    // Best-effort persist; ignore failures so the demo always feels live.
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const uid = userRes.user?.id;
      if (uid) {
        await supabase.from("agent_runs").insert({
          agent_id: id,
          user_id: uid,
          log: `${summary}\n\n${lines.join("\n")}`,
          status: "completed",
        });
        await supabase
          .from("agents")
          .update({ runs_count: (agent.runs_count ?? 0) + 1 })
          .eq("id", id);
      }
    } catch { /* mock-only */ }

    toast.success("Agent run completed");
    setRunning(false);
    window.setTimeout(() => setActiveIndex(undefined), 1500);
  };

  const addStepAt = (index: number) => {
    if (!agent) return;
    const steps = [...(agent.spec.steps ?? [])];
    steps.splice(index, 0, {
      title: "New step",
      integration: INTEGRATIONS[steps.length % INTEGRATIONS.length],
      action: "Configure this step",
    });
    persistSpec({ ...agent.spec, steps });
    setEditing({ kind: "step", index });
  };

  const removeStep = (index: number) => {
    if (!agent) return;
    const steps = (agent.spec.steps ?? []).filter((_, i) => i !== index);
    persistSpec({ ...agent.spec, steps });
    setEditing(null);
  };

  const updateStep = (index: number, patch: Partial<AgentStep>) => {
    if (!agent) return;
    const steps = (agent.spec.steps ?? []).map((s, i) => (i === index ? { ...s, ...patch } : s));
    persistSpec({ ...agent.spec, steps });
  };

  const updateTrigger = (patch: Partial<AgentTrigger>) => {
    if (!agent) return;
    persistSpec({ ...agent.spec, trigger: { ...agent.spec.trigger, ...patch } });
  };

  if (!agent) {
    return (
      <div className="mx-auto flex w-full max-w-5xl items-center justify-center px-6 py-20 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  const steps = agent.spec.steps ?? [];

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col px-6 py-8">
      <Link to="/app/agents" className="mb-4 inline-flex w-fit items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3 w-3" /> Agents
      </Link>
      <PageHeader
        title={agent.name}
        subtitle={agent.description ?? undefined}
        action={
          <div className="flex items-center gap-2">
            {saving && <span className="flex items-center gap-1 text-[11px] text-muted-foreground"><Loader2 className="h-3 w-3 animate-spin" /> Saving</span>}
            <button
              onClick={handleRun}
              disabled={running}
              className="clicky flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-40"
            >
              {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />} Run
            </button>
          </div>
        }
      />

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Canvas */}
        <div className="flex min-h-0 flex-col">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              <GitBranch className="h-3 w-3" /> Workflow editor
            </div>
            <div className="text-[11px] text-muted-foreground">{steps.length} step{steps.length === 1 ? "" : "s"} · click any node to edit</div>
          </div>

          <div
            className="relative flex-1 overflow-auto rounded-2xl border border-black/5 bg-[oklch(0.985_0.005_85)] p-8"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, oklch(0.85 0.01 85) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          >
            <div className="mx-auto flex max-w-md flex-col items-center">
              <CanvasNode
                kind="trigger"
                title={agent.spec.trigger?.type ?? "manual"}
                sub={agent.spec.trigger?.description ?? "Run on demand"}
                Icon={triggerIcon(agent.spec.trigger?.type ?? "manual")}
                status={statusFor(0, activeIndex)}
                index={0}
                selected={editing?.kind === "trigger"}
                onClick={() => setEditing({ kind: "trigger" })}
              />
              <AddRow onClick={() => addStepAt(0)} />
              {steps.map((s, i) => (
                <div key={i} className="flex w-full flex-col items-center">
                  <CanvasNode
                    kind="step"
                    title={s.title}
                    sub={`${s.integration} · ${s.action}`}
                    Icon={Bot}
                    status={statusFor(i + 1, activeIndex)}
                    index={i + 1}
                    selected={editing?.kind === "step" && editing.index === i}
                    onClick={() => setEditing({ kind: "step", index: i })}
                    onDelete={() => removeStep(i)}
                  />
                  <AddRow onClick={() => addStepAt(i + 1)} />
                </div>
              ))}
              <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-black/10 bg-white/60 text-[11px] font-semibold uppercase text-muted-foreground">
                end
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex min-h-0 flex-col rounded-2xl border border-black/5 bg-white">
          {editing ? (
            <EditPanel
              key={editing.kind === "trigger" ? "trigger" : `step-${editing.index}`}
              agent={agent}
              editing={editing}
              onClose={() => setEditing(null)}
              onUpdateTrigger={updateTrigger}
              onUpdateStep={(patch) => editing.kind === "step" && updateStep(editing.index, patch)}
              onDelete={() => editing.kind === "step" && removeStep(editing.index)}
            />
          ) : (
            <>
              <div className="flex shrink-0 items-center justify-between border-b border-black/5 p-2">
                <div className="flex rounded-lg bg-black/[0.04] p-0.5">
                  <TabBtn active={tab === "logs"} onClick={() => setTab("logs")} icon={ListTree}>
                    Logs
                  </TabBtn>
                  <TabBtn active={tab === "chat"} onClick={() => setTab("chat")} icon={MessageSquare}>
                    Edit via chat
                  </TabBtn>
                </div>
              </div>
              {tab === "logs" ? (
                <LogsPanel runs={runs} />
              ) : (
                <ChatEditor
                  agent={agent}
                  onSpecChange={(next, summary) => {
                    persistSpec(next);
                    if (summary) toast.success(summary);
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function statusFor(i: number, activeIndex: number | undefined): "idle" | "pending" | "active" | "done" {
  if (activeIndex === undefined) return "idle";
  if (activeIndex === -1) return "done";
  if (i < activeIndex) return "done";
  if (i === activeIndex) return "active";
  return "pending";
}

function TabBtn({ active, onClick, icon: Icon, children }: { active: boolean; onClick: () => void; icon: typeof Bot; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`clicky-sm flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${
        active ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="h-3.5 w-3.5" /> {children}
    </button>
  );
}

function AddRow({ onClick }: { onClick: () => void }) {
  return (
    <div className="group relative flex h-10 w-full items-center justify-center">
      <div className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-black/10" />
      <button
        onClick={onClick}
        className="clicky-sm relative z-10 flex h-6 w-6 items-center justify-center rounded-full border border-black/10 bg-white text-muted-foreground opacity-0 shadow-sm transition-all hover:scale-110 hover:border-primary hover:text-primary group-hover:opacity-100"
        title="Add step here"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function CanvasNode({
  kind,
  title,
  sub,
  Icon,
  status,
  index,
  selected,
  onClick,
  onDelete,
}: {
  kind: "trigger" | "step";
  title: string;
  sub: string;
  Icon: typeof Bot;
  status: "idle" | "pending" | "active" | "done";
  index: number;
  selected: boolean;
  onClick: () => void;
  onDelete?: () => void;
}) {
  const ring = selected
    ? "ring-2 ring-primary shadow-lg"
    : status === "active"
      ? "ring-2 ring-[oklch(0.72_0.21_45)] shadow-xl shadow-[oklch(0.72_0.21_45)]/25"
      : status === "done"
        ? "ring-1 ring-[oklch(0.72_0.21_45)]/40"
        : "ring-1 ring-black/[0.06]";

  return (
    <div
      onClick={onClick}
      className={`group/node relative w-full cursor-pointer rounded-xl bg-white p-3.5 transition-all hover:-translate-y-0.5 hover:shadow-lg ${ring}`}
      style={{ animation: `fade-in 0.4s ease-out ${index * 50}ms both` }}
    >
      {status === "active" && (
        <span className="pointer-events-none absolute -inset-px rounded-xl bg-[oklch(0.72_0.21_45)]/20 opacity-50 blur-md" />
      )}
      <div className="relative flex items-center gap-2.5">
        <span
          className={`relative flex h-9 w-9 items-center justify-center rounded-lg ${
            status === "done" || status === "active"
              ? "bg-[oklch(0.72_0.21_45)] text-white"
              : kind === "trigger"
                ? "bg-[oklch(0.96_0.02_60)] text-[oklch(0.4_0_0)]"
                : "bg-[oklch(0.97_0_0)] text-[oklch(0.4_0_0)]"
          }`}
        >
          {status === "active" ? <Loader2 className="h-4 w-4 animate-spin" /> : status === "done" ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
          {status === "active" && <span className="absolute inset-0 animate-ping rounded-lg bg-[oklch(0.72_0.21_45)]/30" />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {kind === "trigger" ? "Trigger" : `Step ${index}`}
          </div>
          <div className="truncate text-sm font-semibold capitalize text-foreground">{title}</div>
        </div>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="clicky-sm rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-rose-50 hover:text-rose-600 group-hover/node:opacity-100"
            title="Delete step"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <div className="mt-1.5 line-clamp-2 pl-[46px] text-xs text-muted-foreground">{sub}</div>
      {status === "active" && (
        <div className="mt-2 flex items-center gap-1 pl-[46px] text-[10px] font-semibold text-[oklch(0.55_0.2_40)]">
          <Sparkles className="h-2.5 w-2.5 animate-pulse" /> running
        </div>
      )}
    </div>
  );
}

function EditPanel({
  agent,
  editing,
  onClose,
  onUpdateTrigger,
  onUpdateStep,
  onDelete,
}: {
  agent: Agent;
  editing: { kind: "trigger" } | { kind: "step"; index: number };
  onClose: () => void;
  onUpdateTrigger: (patch: Partial<AgentTrigger>) => void;
  onUpdateStep: (patch: Partial<AgentStep>) => void;
  onDelete: () => void;
}) {
  if (editing.kind === "trigger") {
    const trig = agent.spec.trigger ?? { type: "manual", description: "" };
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-black/5 p-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Edit trigger</div>
          <button onClick={onClose} className="clicky-sm rounded-md p-1 text-muted-foreground hover:bg-black/5"><X className="h-4 w-4" /></button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          <Field label="Trigger type">
            <select
              value={trig.type}
              onChange={(e) => onUpdateTrigger({ type: e.target.value })}
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-primary"
            >
              {TRIGGER_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Description">
            <textarea
              value={trig.description}
              onChange={(e) => onUpdateTrigger({ description: e.target.value })}
              rows={3}
              className="w-full resize-none rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </Field>
          <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-[11px] text-emerald-700">
            <Save className="h-3 w-3" /> Changes save automatically
          </div>
        </div>
      </div>
    );
  }
  const step = agent.spec.steps?.[editing.index];
  if (!step) return null;
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-black/5 p-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Edit step {editing.index + 1}</div>
        <button onClick={onClose} className="clicky-sm rounded-md p-1 text-muted-foreground hover:bg-black/5"><X className="h-4 w-4" /></button>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <Field label="Title">
          <input
            value={step.title}
            onChange={(e) => onUpdateStep({ title: e.target.value })}
            className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </Field>
        <Field label="Integration">
          <select
            value={step.integration}
            onChange={(e) => onUpdateStep({ integration: e.target.value })}
            className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-primary"
          >
            {INTEGRATIONS.includes(step.integration) ? null : <option value={step.integration}>{step.integration}</option>}
            {INTEGRATIONS.map((i) => (<option key={i} value={i}>{i}</option>))}
          </select>
        </Field>
        <Field label="Action">
          <textarea
            value={step.action}
            onChange={(e) => onUpdateStep({ action: e.target.value })}
            rows={3}
            className="w-full resize-none rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </Field>
        <button
          onClick={onDelete}
          className="clicky-sm flex w-full items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete step
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      {children}
    </label>
  );
}

function LogsPanel({ runs }: { runs: Run[] }) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-3">
      <div className="mb-2 flex items-center gap-1.5 px-1 text-[11px] uppercase tracking-wider text-muted-foreground">
        <Activity className="h-3 w-3" /> Recent runs
      </div>
      {runs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-black/[0.08] bg-white/40 p-6 text-center text-xs text-muted-foreground">
          No runs yet — hit Run to try it.
        </div>
      ) : (
        <div className="space-y-2">
          {runs.map((r, idx) => (
            <div key={r.id} className="space-y-1">
              <div className="px-1 text-[10px] uppercase tracking-wider text-muted-foreground">{new Date(r.created_at).toLocaleString()}</div>
              <ReasoningSteps log={r.log} live={idx === 0} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type ChatMsg = { role: "user" | "assistant"; text: string };

function ChatEditor({ agent, onSpecChange }: { agent: Agent; onSpecChange: (next: AgentSpec, summary?: string) => void }) {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      text: `Hi! I can edit "${agent.name}" for you. Try things like "add a Slack notification step", "remove step 2", "rename step 1 to Triage", or "change trigger to schedule daily".`,
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const send = async () => {
    const text = input.trim();
    if (!text || thinking) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setThinking(true);

    await new Promise((r) => setTimeout(r, 450));

    const result = applyChatCommand(agent.spec, text);
    setMessages((m) => [...m, { role: "assistant", text: result.reply }]);
    setThinking(false);
    if (result.next) onSpecChange(result.next, result.toast);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div ref={scrollRef} className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed animate-[fadeInUp_140ms_ease-out] ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "border border-black/5 bg-[oklch(0.98_0_0)] text-foreground"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl border border-black/5 bg-[oklch(0.98_0_0)] px-3 py-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" /> Editing…
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-black/5 p-2">
        <div className="flex items-end gap-1.5 rounded-xl border border-black/10 bg-white p-1.5 focus-within:border-primary/40">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Tell me how to change this agent…"
            rows={1}
            className="max-h-32 min-h-[28px] w-full resize-none bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={send}
            disabled={!input.trim() || thinking}
            className="clicky-sm flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-40"
            title="Send"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function applyChatCommand(spec: AgentSpec, text: string): { reply: string; next?: AgentSpec; toast?: string } {
  const t = text.toLowerCase();
  const steps = [...(spec.steps ?? [])];

  // change trigger
  const trigMatch = t.match(/(?:change|set|make)\s+(?:the\s+)?trigger\s+(?:to\s+)?(schedule|webhook|manual|event)(.*)/);
  if (trigMatch) {
    const type = trigMatch[1];
    const desc = trigMatch[2]?.trim().replace(/^[,:]\s*/, "") || (type === "schedule" ? "Runs on a schedule" : type === "webhook" ? "Triggered by an incoming webhook" : type === "event" ? "Reacts to events" : "Run on demand");
    return {
      reply: `Trigger updated to "${type}".`,
      next: { ...spec, trigger: { type, description: desc } },
      toast: "Trigger updated",
    };
  }

  // remove step
  const remMatch = t.match(/(?:remove|delete|drop)\s+step\s+(\d+)/);
  if (remMatch) {
    const i = Number(remMatch[1]) - 1;
    if (i < 0 || i >= steps.length) return { reply: `There's no step ${i + 1}. The agent has ${steps.length} step${steps.length === 1 ? "" : "s"}.` };
    const removed = steps[i];
    steps.splice(i, 1);
    return { reply: `Removed step ${i + 1} ("${removed.title}").`, next: { ...spec, steps }, toast: "Step removed" };
  }

  // rename step
  const renMatch = t.match(/rename\s+step\s+(\d+)\s+to\s+(.+)/);
  if (renMatch) {
    const i = Number(renMatch[1]) - 1;
    const name = renMatch[2].trim().replace(/[."']+$/g, "");
    if (i < 0 || i >= steps.length) return { reply: `There's no step ${i + 1}.` };
    steps[i] = { ...steps[i], title: name };
    return { reply: `Renamed step ${i + 1} to "${name}".`, next: { ...spec, steps }, toast: "Step renamed" };
  }

  // add step
  if (/\b(add|create|insert|append)\b.*\bstep\b/.test(t) || /\badd\b/.test(t)) {
    const integration =
      INTEGRATIONS.find((i) => t.includes(i.toLowerCase())) ?? INTEGRATIONS[steps.length % INTEGRATIONS.length];
    let title = "New step";
    const titleMatch = text.match(/(?:called|named|titled)\s+["']?([^"']{2,40})["']?/i);
    if (titleMatch) title = titleMatch[1].trim();
    else if (/notif/.test(t)) title = `${integration} notification`;
    else if (/summar/.test(t)) title = `Summarize with ${integration}`;
    else if (/post|send/.test(t)) title = `Post to ${integration}`;
    else if (/fetch|pull|read|sync/.test(t)) title = `Sync from ${integration}`;
    const action =
      /notif|post|send/.test(t)
        ? `Send a message via ${integration}`
        : /summar/.test(t)
          ? `Summarize the latest payload`
          : /fetch|pull|read|sync/.test(t)
            ? `Pull recent records from ${integration}`
            : `Run ${integration} action`;
    steps.push({ title, integration, action });
    return {
      reply: `Added step ${steps.length}: "${title}" (${integration}).`,
      next: { ...spec, steps },
      toast: "Step added",
    };
  }

  return {
    reply:
      "Try one of: \"add a Slack notification step\", \"remove step 2\", \"rename step 1 to Triage\", or \"change trigger to schedule daily\".",
  };
}

function buildMockRuns(agent: Agent): Run[] {
  const steps = agent.spec.steps ?? [];
  const trig = agent.spec.trigger?.description ?? "Triggered";
  const now = Date.now();
  const samples = [
    { summary: `${trig} — completed in 1.4s`, detail: (s: AgentStep) => `${s.integration}: ${s.action} → ok` },
    { summary: `Scheduled run · processed 12 items`, detail: (s: AgentStep) => `${s.title} via ${s.integration} (${s.action})` },
    { summary: `Manual run by you — 8 records updated`, detail: (s: AgentStep) => `${s.integration} • ${s.action} • 200 OK` },
  ];
  return samples.map((sample, i) => {
    const lines = steps.length ? steps.map((s) => `• ${sample.detail(s)}`) : ["• Trigger received", "• Processed payload", "• Wrote results"];
    return {
      id: `mock-${i}`,
      created_at: new Date(now - (i + 1) * 1000 * 60 * 47).toISOString(),
      log: `${sample.summary}\n\n${lines.join("\n")}`,
    };
  });
}
