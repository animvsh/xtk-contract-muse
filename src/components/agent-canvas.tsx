import { Bot, Calendar, Webhook, Zap, MousePointerClick, ArrowRight, Loader2, Check } from "lucide-react";

export type AgentStep = { title: string; integration: string; action: string };
export type AgentTrigger = { type: string; description: string };

const triggerIcon = (type: string) => {
  if (type === "schedule") return Calendar;
  if (type === "webhook") return Webhook;
  if (type === "event") return Zap;
  return MousePointerClick;
};

export function AgentCanvas({
  trigger,
  steps,
  activeIndex,
}: {
  trigger: AgentTrigger;
  steps: AgentStep[];
  activeIndex?: number; // -1 done, 0..n active, undefined idle
}) {
  const TIcon = triggerIcon(trigger.type);
  const all = [
    { kind: "trigger" as const, title: trigger.type, sub: trigger.description, Icon: TIcon },
    ...steps.map((s) => ({ kind: "step" as const, title: s.title, sub: `${s.integration} · ${s.action}`, Icon: Bot })),
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-black/[0.06] bg-white/70 p-6 backdrop-blur">
      <div className="flex min-w-max items-center gap-3">
        {all.map((node, i) => {
          const status =
            activeIndex === undefined
              ? "idle"
              : activeIndex === -1 || i < activeIndex
                ? "done"
                : i === activeIndex
                  ? "active"
                  : "pending";
          return (
            <div key={i} className="flex items-center gap-3">
              <Node title={node.title} sub={node.sub} Icon={node.Icon} kind={node.kind} status={status} />
              {i < all.length - 1 && (
                <ArrowRight
                  className={`h-4 w-4 shrink-0 transition-colors ${status === "done" ? "text-primary" : "text-muted-foreground/40"}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Node({
  title,
  sub,
  Icon,
  kind,
  status,
}: {
  title: string;
  sub: string;
  Icon: typeof Bot;
  kind: "trigger" | "step";
  status: "idle" | "pending" | "active" | "done";
}) {
  const ring =
    status === "active"
      ? "ring-2 ring-primary shadow-lg shadow-primary/20"
      : status === "done"
        ? "ring-1 ring-primary/40"
        : "ring-1 ring-black/[0.06]";
  return (
    <div className={`relative w-56 rounded-xl bg-white p-3 transition-all ${ring}`}>
      <div className="flex items-center gap-2">
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-lg ${
            kind === "trigger" ? "bg-accent text-accent-foreground" : "bg-primary/10 text-primary"
          }`}
        >
          {status === "active" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : status === "done" ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Icon className="h-3.5 w-3.5" />
          )}
        </span>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {kind === "trigger" ? "Trigger" : "Step"}
        </div>
      </div>
      <div className="mt-2 text-sm font-medium capitalize leading-tight">{title}</div>
      <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}
