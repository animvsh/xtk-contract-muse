import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, ArrowRight, Check, Sparkles, Zap, Shield, Bot, Plug, FileText, MessageSquare, Github, Mail, Slack, Send, Upload, FileStack, Paperclip, User as UserIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import foundersIncLogo from "@/assets/founders-inc.png";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Beevr — Your company's second brain" },
      { name: "description", content: "Connect every tool. Ask anything. Beevr searches across Notion, Slack, Gmail and more — and acts on your behalf." },
      { property: "og:title", content: "Beevr — Your company's second brain" },
      { property: "og:description", content: "Connect every tool. Ask anything. Beevr acts on your behalf." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-white text-[oklch(0.15_0_0)]">
      {/* Outer frame */}
      <div className="relative overflow-hidden">
        {/* Soft orange ambient glow */}
        <div className="pointer-events-none absolute -left-40 top-40 h-[600px] w-[400px] rounded-full bg-[oklch(0.72_0.21_45)] opacity-20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-40 top-80 h-[600px] w-[400px] rounded-full bg-[oklch(0.72_0.21_45)] opacity-20 blur-[120px]" />

        {/* Inner rounded white card */}
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[28px] bg-white shadow-2xl">
          {/* Nav */}
          <header className="flex items-center justify-between px-10 py-8">
            <Link to="/" className="clicky-sm flex items-center gap-2.5">
              <BrandLogo className="h-12 w-12 object-contain transition-transform duration-200 hover:rotate-[-8deg] hover:scale-110" />
              <span className="text-xl font-bold tracking-tight">Beevr</span>
            </Link>
            <nav className="hidden items-center gap-10 text-[15px] font-medium text-[oklch(0.25_0_0)] md:flex">
              <a href="#company" className="story-link transition-colors hover:text-black">Company</a>
              <a href="#features" className="story-link transition-colors hover:text-black">Features</a>
              <a href="#pricing" className="story-link transition-colors hover:text-black">Pricing</a>
              <a href="#contacts" className="story-link transition-colors hover:text-black">Contacts</a>
            </nav>
            <div className="flex items-center gap-6">
              <Link to="/auth" className="clicky-sm text-[15px] font-medium text-[oklch(0.25_0_0)] hover:text-black">
                Sign in
              </Link>
              <Link
                to="/onboarding"
                className="clicky shine rounded-xl bg-[oklch(0.68_0.22_40)] px-5 py-2.5 text-[15px] font-semibold text-white shadow-lg shadow-[oklch(0.68_0.22_40)]/30 hover:bg-[oklch(0.62_0.22_40)] hover:shadow-xl hover:shadow-[oklch(0.68_0.22_40)]/50"
              >
                Join the waitlist
              </Link>
            </div>
          </header>

          {/* Hero */}
          <section className="px-10 pb-20 pt-12 text-center">
            <div className="alive mx-auto inline-flex items-center gap-2.5 rounded-full border border-black/10 bg-white/60 px-3 py-1 text-sm text-[oklch(0.3_0_0)] backdrop-blur">
              <span className="text-[oklch(0.45_0_0)]">Backed by</span>
              <img src={foundersIncLogo} alt="Founders, Inc." className="h-4 w-auto object-contain" />
            </div>

            <h1 className="mx-auto mt-8 max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
              Talk to your business.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-[oklch(0.4_0_0)]">
              With intelligent AI that knows everything about your business — from your docs and emails to your customers and revenue.
            </p>

            <div className="mt-10 flex items-center justify-center gap-3">
              <Link
                to="/onboarding"
                className="clicky shine group inline-flex items-center gap-2 rounded-xl bg-[oklch(0.68_0.22_40)] px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-[oklch(0.68_0.22_40)]/40 hover:bg-[oklch(0.62_0.22_40)]"
              >
                <Sparkles className="h-4 w-4" /> Join the waitlist
                <ArrowRight className="nudge-x h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="clicky rounded-xl border border-black/10 bg-white px-6 py-3.5 text-[15px] font-semibold text-[oklch(0.15_0_0)] hover:bg-[oklch(0.97_0_0)]"
              >
                Learn More
              </a>
            </div>

            {/* Tilted dashboard preview */}
            <div className="relative mt-16">
              <div
                className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
                style={{ transform: "perspective(1800px) rotateX(8deg)" }}
              >
                <DashboardPreview />
              </div>
            </div>
          </section>

          {/* Features */}
          <section id="features" className="border-t border-black/5 bg-white px-10 py-20">
            <h2 className="text-center text-4xl font-bold tracking-tight">Built for teams that move fast</h2>
            <div className="stagger mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
              {[
                { icon: Brain, title: "Unified brain", desc: "One search across every doc, channel, and inbox in your stack." },
                { icon: Zap, title: "Cloud agents", desc: "Spin up agents that act on your data — no code, no cron." },
                { icon: Shield, title: "Enterprise-grade", desc: "SOC 2, role-based access, audit logs out of the box." },
              ].map((f) => (
                <div
                  key={f.title}
                  className="alive group cursor-pointer rounded-2xl border border-black/5 bg-[oklch(0.98_0_0)] p-6 hover:border-[oklch(0.68_0.22_40)]/40 hover:bg-white hover:shadow-[0_20px_60px_-20px_oklch(0.68_0.22_40_/_0.35)] active:scale-[0.98]"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[oklch(0.97_0.05_70)] text-[oklch(0.62_0.22_40)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-6deg]">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold transition-colors group-hover:text-[oklch(0.62_0.22_40)]">{f.title}</h3>
                  <p className="mt-2 text-sm text-[oklch(0.4_0_0)]">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Pricing — custom only */}
          <section id="pricing" className="bg-white px-10 py-20">
            <div className="mx-auto max-w-2xl text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-[oklch(0.4_0_0)]">
                <Sparkles className="h-3 w-3 text-[oklch(0.68_0.22_40)]" /> Private beta
              </div>
              <h2 className="mt-4 text-4xl font-bold tracking-tight">Custom pricing</h2>
              <p className="mt-3 text-[oklch(0.4_0_0)]">
                Beevr is hand-rolled for each team in our beta. Join the waitlist and we'll put together a plan that fits your stack, volume, and goals.
              </p>
              <div className="mx-auto mt-10 max-w-md rounded-2xl border border-[oklch(0.68_0.22_40)] bg-[oklch(0.98_0.04_70)] p-8 text-left">
                <div className="text-sm font-medium text-[oklch(0.4_0_0)]">Tailored plan</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-bold">Let's talk</span>
                </div>
                <ul className="mt-6 space-y-2 text-sm">
                  {["Scoped to your team size", "Connectors built for your stack", "White-glove onboarding", "Direct line to the founders"].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[oklch(0.68_0.22_40)]" /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/onboarding"
                  className="clicky shine group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[oklch(0.68_0.22_40)] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[oklch(0.68_0.22_40)]/30 hover:bg-[oklch(0.62_0.22_40)]"
                >
                  Join the waitlist <ArrowRight className="nudge-x h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>

          <footer id="contacts" className="border-t border-black/5 bg-white py-8 text-center text-xs text-[oklch(0.4_0_0)]">
            © 2026 Beevr Inc. — Your company's second brain.
          </footer>
        </div>
      </div>
    </div>
  );
}

type ViewKey = "files" | "agents" | "brain";

const NAV: { key: ViewKey; label: string; icon: typeof Brain }[] = [
  { key: "files", label: "Files", icon: FileStack },
  { key: "agents", label: "Agents", icon: Bot },
  { key: "brain", label: "Brain", icon: Brain },
];

function useTick(ms: number) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN((x) => x + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
  return n;
}

function DashboardPreview() {
  const [view, setView] = useState<ViewKey>("files");
  const [cursor, setCursor] = useState<{ x: number; y: number; click: boolean }>({ x: 110, y: 168, click: false });
  const navRefs = useRef<Record<ViewKey, HTMLDivElement | null>>({ files: null, agents: null, brain: null });
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Cycle views with a moving cursor
  useEffect(() => {
    const order: ViewKey[] = ["files", "agents", "brain"];
    let i = 0;
    let timers: ReturnType<typeof setTimeout>[] = [];
    const cycle = () => {
      i = (i + 1) % order.length;
      const next = order[i];
      const target = navRefs.current[next];
      const root = rootRef.current;
      if (target && root) {
        const tr = target.getBoundingClientRect();
        const rr = root.getBoundingClientRect();
        const x = tr.left - rr.left + tr.width / 2;
        const y = tr.top - rr.top + tr.height / 2;
        setCursor({ x, y, click: false });
        timers.push(setTimeout(() => setCursor((c) => ({ ...c, click: true })), 700));
        timers.push(setTimeout(() => {
          setView(next);
          setCursor((c) => ({ ...c, click: false }));
        }, 850));
      }
      timers.push(setTimeout(cycle, 4200));
    };
    timers.push(setTimeout(cycle, 3500));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div ref={rootRef} className="relative text-[oklch(0.15_0_0)]">
      {/* Browser bar */}
      <div className="flex items-center gap-3 border-b border-black/5 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[oklch(0.7_0.2_25)]" />
          <span className="h-3 w-3 rounded-full bg-[oklch(0.85_0.18_85)]" />
          <span className="h-3 w-3 rounded-full bg-[oklch(0.75_0.18_145)]" />
        </div>
        <div className="mx-auto rounded-md bg-[oklch(0.95_0_0)] px-4 py-1 text-xs text-[oklch(0.4_0_0)]">app.beevr.dev / {view}</div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-48 shrink-0 border-r border-black/5 p-4 text-xs">
          <div className="mb-6 flex items-center gap-2 font-bold">
            <BrandLogo className="h-8 w-8 object-contain" />
            Beevr
          </div>
          <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[oklch(0.5_0_0)]">Main</div>
          <div className="space-y-1">
            {NAV.map((n) => {
              const active = view === n.key;
              return (
                <div
                  key={n.key}
                  ref={(el) => { navRefs.current[n.key] = el; }}
                  className={`flex items-center gap-2 rounded-lg px-2 py-1.5 transition-all duration-300 ${
                    active
                      ? "bg-[oklch(0.97_0.05_70)] font-medium text-[oklch(0.62_0.22_40)]"
                      : "text-[oklch(0.4_0_0)]"
                  }`}
                >
                  <n.icon className="h-3.5 w-3.5" />
                  {n.label}
                </div>
              );
            })}
            <div className="px-2 py-1.5 text-[oklch(0.4_0_0)]">Team Spaces</div>
            <div className="px-2 py-1.5 text-[oklch(0.4_0_0)]">Docs</div>
          </div>
          <div className="mt-6 mb-2 text-[10px] font-medium uppercase tracking-wider text-[oklch(0.5_0_0)]">Other</div>
          <div className="space-y-1">
            <div className="px-2 py-1.5 text-[oklch(0.4_0_0)]">Settings</div>
            <div className="px-2 py-1.5 text-[oklch(0.4_0_0)]">Get Help</div>
          </div>
        </div>

        {/* Content — animated swap */}
        <div key={view} className="flex-1 animate-fade-in p-5">
          {view === "files" && <FilesView />}
          {view === "agents" && <AgentsView />}
          {view === "brain" && <BrainView />}
        </div>
      </div>

      {/* Faux cursor */}
      <div
        className="pointer-events-none absolute z-20 transition-all duration-700 ease-out"
        style={{ left: cursor.x, top: cursor.y, transform: "translate(-2px, -2px)" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" className="drop-shadow-md">
          <path d="M3 2 L3 17 L8 13 L11 20 L14 19 L11 12 L18 12 Z" fill="#111" stroke="white" strokeWidth="1.2" strokeLinejoin="round"/>
        </svg>
        {cursor.click && (
          <span className="absolute -left-2 -top-2 h-7 w-7 animate-ping rounded-full bg-[oklch(0.68_0.22_40)] opacity-60" />
        )}
      </div>
    </div>
  );
}

function BrainView() {
  const tick = useTick(1400);
  const docs = 2450 + (tick % 12) * 7;
  const queries = 1320 + (tick % 18) * 3;
  const heights = [40, 60, 50, 80, 95, 65, 70];
  const activeBar = tick % heights.length;
  const rows = [
    ["Adithya Pradeep", "created Beevr Hiring Doc", "Notion", "Synced"],
    ["Sarah Chen", "merged PR #482", "GitHub", "Synced"],
    ["Sales Digest", "posted weekly summary", "Agent", "Pending"],
    ["Maya Patel", "shared Q3 roadmap", "Slack", "Synced"],
    ["Revenue Bot", "synced Stripe invoices", "Agent", "Pending"],
  ];
  const offset = tick % rows.length;
  const visible = [0, 1, 2].map((i) => rows[(i + offset) % rows.length]);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2 rounded-xl border border-black/5 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold">Knowledge Overview</h4>
          <span className="rounded-md border border-black/10 px-2 py-0.5 text-[10px] text-[oklch(0.4_0_0)]">Last 7 days</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-black/5 p-3">
            <div className="text-[10px] text-[oklch(0.4_0_0)]">Docs indexed</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold tabular-nums">{docs.toLocaleString()}</span>
              <span className="rounded bg-[oklch(0.95_0.06_140)] px-1.5 py-0.5 text-[9px] text-[oklch(0.45_0.18_140)]">↑ 36%</span>
            </div>
          </div>
          <div className="rounded-lg border border-black/5 p-3">
            <div className="text-[10px] text-[oklch(0.4_0_0)]">Queries</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold tabular-nums">{queries.toLocaleString()}</span>
              <span className="rounded bg-[oklch(0.95_0.06_140)] px-1.5 py-0.5 text-[9px] text-[oklch(0.45_0.18_140)]">↑ 18%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-black/5 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold">Activity</h4>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[oklch(0.68_0.22_40)]" />
        </div>
        <div className="flex h-24 items-end gap-1.5">
          {heights.map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-sm transition-all duration-500 ${
                i === activeBar ? "bg-[oklch(0.68_0.22_40)]" : "bg-[oklch(0.92_0_0)]"
              }`}
              style={{ height: `${h + (i === activeBar ? 5 : 0)}%` }}
            />
          ))}
        </div>
      </div>

      <div className="col-span-3 rounded-xl border border-black/5 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold">Recent activity</h4>
          <div className="rounded-md bg-[oklch(0.97_0_0)] px-2 py-1 text-[10px] text-[oklch(0.4_0_0)]">Search…</div>
        </div>
        <div className="space-y-2 text-xs">
          {visible.map(([who, what, src, status], i) => (
            <div
              key={`${who}-${tick}`}
              className="grid grid-cols-4 items-center border-t border-black/5 py-2 first:border-0 animate-fade-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="font-medium">{who}</span>
              <span className="text-[oklch(0.4_0_0)]">{what}</span>
              <span className="text-[oklch(0.4_0_0)]">{src}</span>
              <span>
                <span className={`rounded-md px-2 py-0.5 text-[10px] ${
                  status === "Pending"
                    ? "bg-[oklch(0.97_0.08_85)] text-[oklch(0.55_0.18_70)]"
                    : "bg-[oklch(0.95_0.06_140)] text-[oklch(0.45_0.18_140)]"
                }`}>{status}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AgentsView() {
  const tick = useTick(1100);
  const logs = [
    "[trigger] schedule fired · 9:00 AM",
    "[step] querying Stripe · invoices.list",
    "[step] aggregating revenue by segment",
    "[step] drafting weekly summary",
    "[tool] slack.post → #revenue",
    "[done] completed in 4.2s",
  ];
  const shown = logs.slice(0, Math.min(logs.length, (tick % (logs.length + 2)) + 1));
  const agents = [
    { name: "Revenue Digest", status: "Running", icon: Sparkles, color: "oklch(0.68_0.22_40)" },
    { name: "Hiring Pipeline", status: "Idle", icon: Bot, color: "oklch(0.6_0.15_240)" },
    { name: "Support Triage", status: "Running", icon: Zap, color: "oklch(0.65_0.18_140)" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {agents.map((a, i) => {
        const running = a.status === "Running";
        return (
          <div key={a.name} className="rounded-xl border border-black/5 bg-white p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: `color-mix(in oklab, ${a.color} 14%, white)` }}>
                <a.icon className="h-3.5 w-3.5" style={{ color: a.color }} />
              </div>
              <div className="text-xs font-semibold">{a.name}</div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[10px]">
              <span className={`h-1.5 w-1.5 rounded-full ${running ? "animate-pulse bg-[oklch(0.68_0.22_40)]" : "bg-[oklch(0.85_0_0)]"}`} />
              <span className="text-[oklch(0.4_0_0)]">{a.status}{running ? ` · step ${(tick % 4) + 1}/4` : ""}</span>
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded bg-[oklch(0.95_0_0)]">
              <div
                className="h-full rounded transition-all duration-500"
                style={{
                  width: running ? `${20 + ((tick + i * 3) % 8) * 10}%` : "0%",
                  background: a.color,
                }}
              />
            </div>
          </div>
        );
      })}

      <div className="col-span-3 rounded-xl border border-black/5 bg-[oklch(0.13_0_0)] p-4 text-[oklch(0.92_0_0)]">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-xs font-semibold">Live logs · Revenue Digest</h4>
          <span className="flex items-center gap-1 text-[10px] text-[oklch(0.7_0_0)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[oklch(0.68_0.22_40)]" /> streaming
          </span>
        </div>
        <div className="space-y-1 font-mono text-[11px]">
          {shown.map((l, i) => (
            <div key={`${l}-${tick}`} className="animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
              <span className="text-[oklch(0.55_0_0)]">›</span> <span className={l.includes("[done]") ? "text-[oklch(0.75_0.18_145)]" : l.includes("[tool]") ? "text-[oklch(0.78_0.18_85)]" : "text-[oklch(0.92_0_0)]"}>{l}</span>
            </div>
          ))}
          <div className="inline-block h-3 w-1.5 animate-pulse bg-[oklch(0.68_0.22_40)]" />
        </div>
      </div>
    </div>
  );
}

function ConnectionsView() {
  const tick = useTick(900);
  const items = [
    { name: "Notion", icon: FileText, color: "oklch(0.2_0_0)" },
    { name: "GitHub", icon: Github, color: "oklch(0.2_0_0)" },
    { name: "Slack", icon: Slack, color: "oklch(0.55_0.2_300)" },
    { name: "Gmail", icon: Mail, color: "oklch(0.6_0.2_25)" },
    { name: "Linear", icon: Zap, color: "oklch(0.5_0.18_270)" },
    { name: "Stripe", icon: Send, color: "oklch(0.55_0.2_270)" },
  ];
  const syncing = tick % items.length;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-black/5 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold">Connections</h4>
          <span className="text-[10px] text-[oklch(0.4_0_0)]">{items.length} connected</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {items.map((it, i) => {
            const isSync = i === syncing;
            return (
              <div key={it.name} className="flex items-center gap-3 rounded-lg border border-black/5 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[oklch(0.97_0_0)]">
                  <it.icon className="h-4 w-4" style={{ color: it.color }} />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold">{it.name}</div>
                  <div className="mt-0.5 flex items-center gap-1 text-[10px]">
                    <span className={`h-1.5 w-1.5 rounded-full ${isSync ? "animate-pulse bg-[oklch(0.68_0.22_40)]" : "bg-[oklch(0.75_0.18_145)]"}`} />
                    <span className="text-[oklch(0.4_0_0)]">{isSync ? "Syncing…" : "Up to date"}</span>
                  </div>
                </div>
                <Check className="h-3.5 w-3.5 text-[oklch(0.6_0.18_140)]" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-black/5 bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-xs font-semibold">Indexing</h4>
          <span className="text-[10px] text-[oklch(0.4_0_0)]">{items[syncing].name}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded bg-[oklch(0.95_0_0)]">
          <div
            className="h-full rounded bg-[oklch(0.68_0.22_40)] transition-all duration-700"
            style={{ width: `${10 + (tick % 10) * 9}%` }}
          />
        </div>
        <div className="mt-2 flex items-center gap-1 text-[10px] text-[oklch(0.4_0_0)]">
          <MessageSquare className="h-3 w-3" />
          {1200 + (tick % 30) * 11} chunks embedded
        </div>
      </div>
    </div>
  );
}
