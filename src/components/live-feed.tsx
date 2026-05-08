import { useEffect, useRef, useState } from "react";
import {
  FileText,
  MessageSquare,
  Mail,
  GitBranch,
  Calendar,
  DollarSign,
  Users,
  Zap,
  Bot,
} from "lucide-react";

type Update = {
  id: string;
  icon: typeof FileText;
  source: string;
  text: string;
  color: string;
  ts: number;
};

const POOL: Omit<Update, "id" | "ts">[] = [
  { icon: FileText, source: "Notion", text: "Adithya created 'Q4 Hiring Plan'", color: "oklch(0.25 0 0)" },
  { icon: MessageSquare, source: "Slack", text: "12 new messages in #engineering", color: "oklch(0.55 0.22 320)" },
  { icon: Mail, source: "Gmail", text: "Maya replied to 'Onboarding'", color: "oklch(0.6 0.22 25)" },
  { icon: GitBranch, source: "GitHub", text: "PR #482 merged by Sarah", color: "oklch(0.25 0 0)" },
  { icon: Bot, source: "Agent", text: "Sales Digest posted weekly summary", color: "oklch(0.62 0.22 40)" },
  { icon: FileText, source: "Drive", text: "New file: 'Investor Update Nov.pdf'", color: "oklch(0.55 0.18 145)" },
  { icon: Calendar, source: "Calendar", text: "Meeting 'Design review' starts in 15m", color: "oklch(0.55 0.2 250)" },
  { icon: DollarSign, source: "Stripe", text: "$4,820 invoice paid by Acme Corp", color: "oklch(0.55 0.2 280)" },
  { icon: Users, source: "HubSpot", text: "New deal: Globex · $42k", color: "oklch(0.62 0.22 35)" },
  { icon: Zap, source: "Linear", text: "Adithya moved BEE-218 to In Progress", color: "oklch(0.5 0.2 280)" },
  { icon: MessageSquare, source: "Slack", text: "Animesh mentioned you in #product", color: "oklch(0.55 0.22 320)" },
  { icon: FileText, source: "Notion", text: "Sarah edited 'Beevr Brand Guidelines'", color: "oklch(0.25 0 0)" },
  { icon: Bot, source: "Agent", text: "Inbox Triage labeled 7 emails", color: "oklch(0.62 0.22 40)" },
  { icon: Mail, source: "Gmail", text: "Contract signed by adithya@beevr.io", color: "oklch(0.6 0.22 25)" },
];

function relative(ts: number, now: number): string {
  const s = Math.max(1, Math.floor((now - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

export function LiveFeed() {
  const now0 = Date.now();
  const [items, setItems] = useState<Update[]>(() =>
    POOL.slice(0, 4).map((p, i) => ({ ...p, id: `seed-${i}`, ts: now0 - (i + 1) * 45_000 })),
  );
  const [newCount, setNewCount] = useState(0);
  const [now, setNow] = useState(now0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tick = () => {
      const pick = POOL[Math.floor(Math.random() * POOL.length)];
      setItems((prev) =>
        [{ ...pick, id: crypto.randomUUID(), ts: Date.now() }, ...prev].slice(0, 12),
      );
      setNewCount((n) => n + 1);
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    };
    const schedule = (): ReturnType<typeof setTimeout> => {
      const delay = 2500 + Math.random() * 3500;
      return setTimeout(() => {
        tick();
        timer = schedule();
      }, delay);
    };
    let timer = schedule();
    const clock = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(clock);
    };
  }, []);

  return (
    <div className="hidden w-72 shrink-0 border-l border-black/5 bg-gradient-to-b from-white/70 to-white/30 backdrop-blur lg:flex lg:flex-col">
      <div className="flex items-center justify-between border-b border-black/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <h3 className="text-sm font-semibold tracking-tight">Live activity</h3>
        </div>
        {newCount > 0 && (
          <button
            onClick={() => {
              setNewCount(0);
              scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="clicky rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary hover:bg-primary/25"
          >
            {newCount} new
          </button>
        )}
      </div>
      <div ref={scrollRef} className="relative flex-1 overflow-y-auto px-3 py-3">
        {/* timeline rail */}
        <div className="pointer-events-none absolute bottom-3 left-[26px] top-3 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
        <ul className="space-y-2">
          {items.map((item, idx) => {
            const Icon = item.icon;
            const isNew = idx === 0;
            return (
              <li
                key={item.id}
                className={`group relative flex items-start gap-3 rounded-xl border bg-white/90 p-2.5 text-xs shadow-sm transition-all ${
                  isNew
                    ? "animate-pop border-primary/40 shadow-[0_0_0_3px_color-mix(in_oklab,var(--primary)_15%,transparent)]"
                    : "border-black/[0.05] hover:-translate-y-0.5 hover:border-black/10 hover:shadow-md"
                }`}
                style={{ opacity: Math.max(0.55, 1 - idx * 0.04) }}
              >
                <div className="relative">
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white shadow-sm ring-2 ring-white"
                    style={{ backgroundColor: item.color }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  {isNew && (
                    <span
                      className="absolute -inset-0.5 -z-0 animate-ping rounded-lg opacity-60"
                      style={{ backgroundColor: item.color }}
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      {item.source}
                    </span>
                    <span className="shrink-0 tabular-nums text-[10px] text-muted-foreground/70">
                      {relative(item.ts, now)}
                    </span>
                  </div>
                  <div className="mt-0.5 truncate text-foreground">{item.text}</div>
                </div>
              </li>
            );
          })}
        </ul>
        {/* fade */}
        <div className="pointer-events-none sticky bottom-0 -mx-3 h-8 bg-gradient-to-t from-white/80 to-transparent" />
      </div>
    </div>
  );
}
