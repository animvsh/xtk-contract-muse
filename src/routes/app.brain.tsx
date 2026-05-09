import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  Send,
  Brain,
  Loader2,
  Check,
  ChevronDown,
  FileText,
  Search,
  Mail,
  User,
  FileStack,
  AlertCircle,
  Inbox,
  BookOpen,
  Circle,
  MessageSquare,
  Clock,
  Zap,
  Sparkles,
  Hash,
  Phone,
  Plug,
  Server,
  Code2,
  PlayCircle,
} from "lucide-react";

import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/app/brain")({
  validateSearch: z.object({ q: z.string().optional() }),
  component: BrainPage,
});

const TOOL_META: Record<
  string,
  { label: string; icon: typeof Search; verb: string }
> = {
  searchNotion: { label: "Notion", icon: FileStack, verb: "Searching Notion" },
  searchContacts: { label: "Contacts", icon: User, verb: "Looking up contact" },
  searchEmails: { label: "Gmail", icon: Inbox, verb: "Searching inbox" },
  summarizeDoc: { label: "Summarize", icon: BookOpen, verb: "Reading document" },
  draftDocument: { label: "Draft", icon: FileText, verb: "Drafting document" },
  sendEmail: { label: "Email", icon: Mail, verb: "Sending email" },
};

type StepStatus = "pending" | "in-progress" | "done" | "warning";
type PlanSubtask = { id: string; title: string; status: StepStatus };
type PlanTask = { id: string; title: string; status: StepStatus; subtasks: PlanSubtask[] };

type AgentDraft = {
  name: string;
  description: string;
  emoji: string;
  schedule: { cadence: "hourly" | "daily" | "weekly" | "weekdays" | "monthly"; timeOfDay: string };
  trigger: string;
  action: string;
  dataSources: string[];
  channel: "sms" | "email" | "slack" | "in-app";
  recipient?: string;
  tools: string[];
};

type ApiParam = {
  name: string;
  in: "query" | "body" | "path";
  type: "string" | "number" | "boolean" | "array" | "object";
  required: boolean;
  description: string;
  example?: string;
};
type ApiEndpoint = { method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"; path: string; summary: string };
type ApiDraft = {
  name: string;
  description: string;
  emoji: string;
  kind: "rest" | "function";
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  params: ApiParam[];
  sampleResponse: string;
  endpoints: ApiEndpoint[];
};


function BrainPage() {
  const { q } = Route.useSearch();
  const [input, setInput] = useState("");
  const transport = useRef(new DefaultChatTransport({ api: "/api/chat" })).current;
  const { messages, sendMessage, status, error } = useChat({
    transport,
    onError: (e) => toast.error(e.message || "Chat error"),
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sentInitial = useRef(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (q && !sentInitial.current) {
      sentInitial.current = true;
      sendMessage({ text: q });
    }
  }, [q, sendMessage]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, status]);

  const isLoading = status === "submitted" || status === "streaming";

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input.trim() });
    setInput("");
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth">
        <div className={`mx-auto w-full max-w-3xl px-6 ${isEmpty ? "flex min-h-full flex-col justify-center pb-32 pt-8" : "pb-40 pt-10"}`}>
          {isEmpty && (
            <div className="animate-[fadeInUp_300ms_ease-out]">
              <div className="float-y wobble-hover mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <Brain className="h-7 w-7" />
              </div>
              <h1 className="text-4xl font-semibold tracking-tight">Ask your company brain</h1>
              <p className="mt-2 text-base text-muted-foreground">
                Connected to Notion, Gmail contacts, document drafting, and email.
              </p>
              <div className="stagger mt-8 grid gap-2 text-sm sm:grid-cols-2">
                {[
                  "Look at the doc about Beevr and send Adithya an employment contract",
                  "Find the Q3 roadmap in Notion and summarize it",
                  "Draft a follow-up email to the latest customer thread",
                  "Who emailed me about pricing this week?",
                ].map((s, i) => (
                  <button
                    key={s}
                    onClick={() => sendMessage({ text: s })}
                    style={{ ['--i' as never]: i }}
                    className="clicky alive slide-in-right group rounded-xl border border-black/5 bg-white/70 px-4 py-3 text-left leading-snug text-foreground/80 shadow-sm backdrop-blur transition-all hover:border-primary/30 hover:bg-white hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            {messages.map((msg) =>
              msg.role === "user" ? (
                <div key={msg.id} className="flex justify-end">
                  <div className="slide-in-right max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-[15px] leading-relaxed text-primary-foreground shadow-sm">
                    {msg.parts
                      .map((p) => (p.type === "text" ? p.text : ""))
                      .join("")}
                  </div>
                </div>
              ) : (
                <AssistantMessage key={msg.id} msg={msg} />
              ),
            )}
            {status === "submitted" && (
              <div className="animate-pop flex gap-3">
                <div className="ring-pulse float-y flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Brain className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm">
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
                  </span>
                  <span className="shimmer-text caret">Thinking</span>
                </div>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error.message}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
        <div className="h-4 bg-white" />
        <div className="pointer-events-auto bg-white/80 px-6 pb-5 pt-2 backdrop-blur-xl">
          <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-black/10 bg-white p-2 shadow-lg shadow-black/5 transition-all focus-within:border-primary/50 focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_15%,transparent)]">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={1}
              placeholder="Ask anything about your company…"
              className="max-h-40 flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] outline-none placeholder:text-muted-foreground"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="clicky clicky-sm flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-all hover:shadow-md disabled:opacity-40"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-muted-foreground/70">
            Press Enter to send · Shift + Enter for new line
          </p>
        </div>
      </div>

    </div>
  );
}

type UIMsg = ReturnType<typeof useChat>["messages"][number];

type ToolPartShape = {
  type: string;
  toolCallId?: string;
  state: "input-streaming" | "input-available" | "output-available" | "output-error";
  input?: unknown;
  output?: unknown;
  errorText?: string;
};

function AssistantMessage({ msg }: { msg: UIMsg }) {
  // Build the live plan + ordered render units from message parts
  const plan: PlanTask[] = [];
  const taskIndex = new Map<string, PlanTask>();
  const subtaskIndex = new Map<string, { task: PlanTask; sub: PlanSubtask }>();

  type Unit =
    | { kind: "text"; key: string; text: string }
    | { kind: "tool"; key: string; part: ToolPartShape }
    | { kind: "agent"; key: string; draft: AgentDraft }
    | { kind: "api"; key: string; draft: ApiDraft }
    | { kind: "plan"; key: string; snapshot: PlanTask[]; running: boolean };


  const units: Unit[] = [];
  let planIntroduced = false;

  msg.parts.forEach((part, idx) => {
    if (part.type === "text") {
      units.push({ kind: "text", key: `t${idx}`, text: part.text });
      return;
    }
    if (!part.type.startsWith("tool-")) return;
    const tp = part as ToolPartShape;
    const name = tp.type.replace(/^tool-/, "");

    if (name === "proposeAgent") {
      const input = tp.input as AgentDraft | undefined;
      if (input && input.name) {
        units.push({ kind: "agent", key: `a${idx}`, draft: input });
      }
      return;
    }

    if (name === "proposeApi") {
      const input = tp.input as ApiDraft | undefined;
      if (input && input.name) {
        units.push({ kind: "api", key: `api${idx}`, draft: input });
      }
      return;
    }

    if (name === "createPlan") {
      const input = tp.input as { tasks?: PlanTask[] } | undefined;
      const tasks = input?.tasks ?? [];
      tasks.forEach((t) => {
        const task: PlanTask = {
          id: t.id,
          title: t.title,
          status: "pending",
          subtasks: (t.subtasks ?? []).map((s) => ({
            id: s.id,
            title: s.title,
            status: "pending",
          })),
        };
        plan.push(task);
        taskIndex.set(task.id, task);
        task.subtasks.forEach((s) => subtaskIndex.set(s.id, { task, sub: s }));
      });
      if (!planIntroduced && plan.length > 0) {
        planIntroduced = true;
        units.push({ kind: "plan", key: "plan", snapshot: [], running: true });
      }
      return;
    }

    if (name === "updateStep") {
      const input = tp.input as { id?: string; status?: StepStatus } | undefined;
      if (input?.id && input.status) {
        const t = taskIndex.get(input.id);
        if (t) t.status = input.status;
        const s = subtaskIndex.get(input.id);
        if (s) s.sub.status = input.status;
      }
      return;
    }

    units.push({ kind: "tool", key: `x${idx}`, part: tp });
  });

  // Snapshot the final plan into the placeholder unit
  const planUnit = units.find((u) => u.kind === "plan");
  if (planUnit && planUnit.kind === "plan") {
    planUnit.snapshot = JSON.parse(JSON.stringify(plan)) as PlanTask[];
    const allDone = plan.length > 0 && plan.every(
      (t) => t.status === "done" || t.status === "warning",
    );
    planUnit.running = !allDone;
  }

  return (
    <div className="flex gap-3">
      <div className="wobble-hover flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
        <Brain className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1 space-y-3">
        {units.map((u) => {
          if (u.kind === "text") {
            return (
              <div key={u.key} className="slide-in-left whitespace-pre-wrap rounded-2xl rounded-tl-md border border-black/5 bg-white/80 px-4 py-3 text-[15px] leading-relaxed text-foreground shadow-sm backdrop-blur">
                {u.text}
              </div>
            );
          }
          if (u.kind === "plan") {
            return <PlanBlock key={u.key} tasks={u.snapshot} running={u.running} />;
          }
          if (u.kind === "agent") {
            return <AgentProposalCard key={u.key} draft={u.draft} />;
          }
          return <ToolPart key={u.key} part={u.part} />;
        })}
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: StepStatus }) {
  if (status === "done") {
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-600">
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
    );
  }
  if (status === "warning") {
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-600">
        <AlertCircle className="h-3 w-3" />
      </span>
    );
  }
  if (status === "in-progress") {
    return (
      <span className="relative flex h-5 w-5 items-center justify-center">
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-dashed border-primary/70" style={{ animationDuration: "3s" }} />
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      </span>
    );
  }
  return (
    <span className="flex h-5 w-5 items-center justify-center text-muted-foreground/50">
      <Circle className="h-4 w-4" />
    </span>
  );
}

function StatusBadge({ status, count }: { status: StepStatus; count?: number }) {
  const map: Record<StepStatus, string> = {
    "in-progress": "bg-primary/10 text-primary border-primary/20",
    done: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    pending: "bg-muted text-muted-foreground border-border",
  };
  const label = status === "pending" ? "pending" : status;
  return (
    <span className="flex items-center gap-1.5">
      {count !== undefined && count > 0 && (
        <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground">
          {count}
        </span>
      )}
      <span className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${map[status]}`}>
        {label}
      </span>
    </span>
  );
}

function PlanBlock({ tasks, running }: { tasks: PlanTask[]; running: boolean }) {
  if (tasks.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span className="shimmer-text">Drafting plan…</span>
      </div>
    );
  }
  return (
    <div className="animate-pop overflow-hidden rounded-2xl border border-black/10 bg-white/90 p-2 shadow-sm backdrop-blur">
      <div className="flex flex-col">
        {tasks.map((task, ti) => {
          const pendingSubs = task.subtasks.filter((s) => s.status === "pending").length;
          return (
            <div key={task.id} className={`group/row px-3 py-3 ${ti > 0 ? "border-t border-black/5" : ""}`}>
              <div className="flex items-center gap-3">
                <StatusIcon status={task.status} />
                <span className={`flex-1 text-[15px] font-medium ${task.status === "done" ? "text-foreground/60" : "text-foreground"}`}>
                  {task.title}
                </span>
                <StatusBadge status={task.status} count={task.status === "pending" ? pendingSubs : undefined} />
              </div>
              {task.subtasks.length > 0 && (task.status === "in-progress" || task.subtasks.some((s) => s.status !== "pending")) && (
                <div className="relative mt-2.5 ml-2.5 space-y-2 border-l border-dashed border-black/15 pl-5">
                  {task.subtasks.map((sub) => (
                    <div key={sub.id} className="animate-[fadeInUp_240ms_ease-out] flex items-center gap-2.5">
                      <StatusIcon status={sub.status} />
                      <span className={`text-[14px] ${
                        sub.status === "done"
                          ? "text-muted-foreground line-through"
                          : sub.status === "in-progress"
                            ? "text-foreground"
                            : "text-foreground/80"
                      }`}>
                        {sub.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {running && (
        <div className="mt-1 flex items-center gap-2 border-t border-black/5 px-3 py-2 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span className="shimmer-text">Working through plan…</span>
        </div>
      )}
    </div>
  );
}

function ToolPart({ part }: { part: ToolPartShape }) {
  const [open, setOpen] = useState(false);
  const toolName = part.type.replace(/^tool-/, "");
  const meta = TOOL_META[toolName] ?? {
    label: toolName,
    icon: Search,
    verb: toolName,
  };
  const Icon = meta.icon;
  const isRunning =
    part.state === "input-streaming" || part.state === "input-available";
  const isError = part.state === "output-error";
  const isDone = part.state === "output-available";

  return (
    <div className={`animate-pop overflow-hidden rounded-lg border bg-muted/40 transition-colors ${isRunning ? "border-primary/40" : "border-border"}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="clicky-sm flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-muted/70 active:bg-muted"
      >
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-md ${
            isDone
              ? "bg-accent text-primary"
              : isError
                ? "bg-destructive/10 text-destructive"
                : "bg-primary/15 text-primary"
          }`}
        >
          {isRunning ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : isError ? (
            <AlertCircle className="h-3.5 w-3.5" />
          ) : isDone ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Icon className="h-3.5 w-3.5" />
          )}
        </span>
        <span className="flex-1 truncate">
          <span className="font-medium text-foreground">{meta.label}</span>
          <span className="ml-2 text-muted-foreground">
            {isRunning
              ? `${meta.verb}…`
              : isError
                ? "Failed"
                : summarizeInput(toolName, part.input)}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="space-y-2 border-t border-border px-3 py-2 text-xs">
          {part.input !== undefined && (
            <div>
              <div className="mb-1 font-medium text-muted-foreground">Input</div>
              <pre className="overflow-x-auto rounded bg-background p-2 text-foreground">
                {JSON.stringify(part.input, null, 2)}
              </pre>
            </div>
          )}
          {part.output !== undefined && (
            <div>
              <div className="mb-1 font-medium text-muted-foreground">Output</div>
              <pre className="overflow-x-auto rounded bg-background p-2 text-foreground">
                {JSON.stringify(part.output, null, 2)}
              </pre>
            </div>
          )}
          {part.errorText && (
            <div className="text-destructive">{part.errorText}</div>
          )}
        </div>
      )}
    </div>
  );
}

function summarizeInput(name: string, input: unknown): string {
  if (!input || typeof input !== "object") return "";
  const i = input as Record<string, unknown>;
  if (name === "searchNotion") return `"${i.query}"`;
  if (name === "searchEmails") return `"${i.query}"`;
  if (name === "searchContacts") return `"${i.name}"`;
  if (name === "summarizeDoc") return `${i.url}`;
  if (name === "draftDocument") return `${i.title}`;
  if (name === "sendEmail") return `→ ${i.to}`;
  return "";
}

const CHANNEL_META: Record<AgentDraft["channel"], { label: string; icon: typeof Phone; tone: string }> = {
  sms: { label: "Text message", icon: Phone, tone: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  email: { label: "Email", icon: Mail, tone: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  slack: { label: "Slack", icon: Hash, tone: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  "in-app": { label: "In-app notification", icon: MessageSquare, tone: "bg-primary/10 text-primary border-primary/20" },
};

const CADENCE_LABEL: Record<AgentDraft["schedule"]["cadence"], string> = {
  hourly: "Every hour",
  daily: "Every day",
  weekdays: "Weekdays",
  weekly: "Every week",
  monthly: "Every month",
};

function AgentProposalCard({ draft }: { draft: AgentDraft }) {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState<{ id: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [d, setD] = useState<AgentDraft>(draft);
  const channel = CHANNEL_META[d.channel];
  const ChannelIcon = channel.icon;

  const update = <K extends keyof AgentDraft>(k: K, v: AgentDraft[K]) =>
    setD((cur) => ({ ...cur, [k]: v }));

  const save = async () => {
    setBusy(true);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;
      if (!user) throw new Error("Sign in required");
      const { data: row, error } = await supabase
        .from("agents")
        .insert({
          name: d.name,
          description: d.description,
          status: "active",
          spec: d as never,
          user_id: user.id,
        })
        .select("id")
        .single();
      if (error) throw error;
      setSaved({ id: row.id });
      toast.success(`${d.emoji} ${d.name} created`, {
        description: `${d.trigger} · ${d.action}`,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save agent");
    } finally {
      setBusy(false);
    }
  };

  if (saved) {
    return (
      <div className="animate-pop relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-50 to-white p-5">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500 text-white text-lg">
            <Check className="h-5 w-5" strokeWidth={3} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl leading-none">{d.emoji}</span>
              <h3 className="text-base font-semibold">{d.name} is live</h3>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {d.trigger.toLowerCase()} · {d.action.toLowerCase()}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => navigate({ to: "/app/agents/$id", params: { id: saved.id } })}
                className="clicky-sm inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-black/[0.03]"
              >
                Open agent <ChevronDown className="h-3 w-3 -rotate-90" />
              </button>
              <button
                onClick={() => navigate({ to: "/app/agents" })}
                className="clicky-sm rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                See all agents
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-pop relative overflow-hidden rounded-2xl border border-primary/20 bg-white">
      {/* Glow header */}
      <div className="relative px-5 pt-5 pb-4">
        <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative flex items-start gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-2xl shadow-lg shadow-primary/20">
            <span aria-hidden>{d.emoji}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3 w-3" />
              New agent draft
            </div>
            {editing ? (
              <input
                value={d.name}
                onChange={(e) => update("name", e.target.value)}
                className="mt-0.5 w-full rounded-md border border-black/10 bg-white px-2 py-1 text-base font-semibold outline-none focus:border-primary"
              />
            ) : (
              <h3 className="mt-0.5 truncate text-base font-semibold">{d.name}</h3>
            )}
            {editing ? (
              <textarea
                value={d.description}
                onChange={(e) => update("description", e.target.value)}
                rows={2}
                className="mt-1.5 w-full resize-none rounded-md border border-black/10 bg-white px-2 py-1 text-sm outline-none focus:border-primary"
              />
            ) : (
              <p className="mt-0.5 text-sm text-muted-foreground">{d.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Body grid */}
      <div className="grid divide-y divide-black/5 border-t border-black/5 sm:grid-cols-2 sm:divide-y-0 sm:divide-x">
        <div className="flex items-start gap-3 p-4">
          <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Clock className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">When</div>
            {editing ? (
              <div className="mt-1 flex gap-1.5">
                <select
                  value={d.schedule.cadence}
                  onChange={(e) => update("schedule", { ...d.schedule, cadence: e.target.value as AgentDraft["schedule"]["cadence"] })}
                  className="rounded-md border border-black/10 bg-white px-2 py-1 text-sm outline-none focus:border-primary"
                >
                  {Object.entries(CADENCE_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
                <input
                  type="time"
                  value={d.schedule.timeOfDay}
                  onChange={(e) => update("schedule", { ...d.schedule, timeOfDay: e.target.value })}
                  className="rounded-md border border-black/10 bg-white px-2 py-1 text-sm outline-none focus:border-primary"
                />
              </div>
            ) : (
              <div className="mt-0.5 text-sm font-medium">
                {CADENCE_LABEL[d.schedule.cadence]} at {d.schedule.timeOfDay}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3 p-4">
          <div className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border ${channel.tone}`}>
            <ChannelIcon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Send via</div>
            {editing ? (
              <div className="mt-1 flex flex-col gap-1.5">
                <select
                  value={d.channel}
                  onChange={(e) => update("channel", e.target.value as AgentDraft["channel"])}
                  className="rounded-md border border-black/10 bg-white px-2 py-1 text-sm outline-none focus:border-primary"
                >
                  {Object.entries(CHANNEL_META).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
                <input
                  placeholder={d.channel === "sms" ? "+1 555 0123" : d.channel === "email" ? "you@company.com" : "#channel"}
                  value={d.recipient ?? ""}
                  onChange={(e) => update("recipient", e.target.value)}
                  className="rounded-md border border-black/10 bg-white px-2 py-1 text-sm outline-none focus:border-primary"
                />
              </div>
            ) : (
              <div className="mt-0.5 text-sm font-medium">
                {channel.label}
                {d.recipient && <span className="ml-1 text-muted-foreground">→ {d.recipient}</span>}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 sm:col-span-2 sm:border-t sm:border-black/5">
          <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-amber-500/10 text-amber-600">
            <Zap className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">What it does</div>
            <div className="mt-0.5 text-sm">{d.action}</div>
            {d.dataSources.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {d.dataSources.map((src) => (
                  <span key={src} className="inline-flex items-center gap-1 rounded-md border border-black/10 bg-muted/40 px-2 py-0.5 text-[11px] font-medium text-foreground/80">
                    <Plug className="h-2.5 w-2.5" /> {src}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 border-t border-black/5 bg-muted/30 px-4 py-3">
        <button
          onClick={() => setEditing((v) => !v)}
          className="clicky-sm rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-black/5 hover:text-foreground"
        >
          {editing ? "Done editing" : "Edit details"}
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toast("Discarded draft")}
            className="clicky-sm rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-black/5"
          >
            Dismiss
          </button>
          <button
            onClick={save}
            disabled={busy}
            className="clicky inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            {busy ? "Creating…" : "Create agent"}
          </button>
        </div>
      </div>
    </div>
  );
}
