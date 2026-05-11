import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, ArrowRight, Check, Sparkles, Zap, Shield, Bot, FileText, MessageSquare, Mail, Send, Upload, FileStack, Paperclip } from "lucide-react";
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

// === FILES VIEW: drag-drop + processing pipeline ===
function FilesView() {
  const tick = useTick(900);
  const phase = tick % 12; // 0–3 hover, 4 dropped, 5–8 uploading, 9–11 processed
  const dropped = phase >= 4;
  const uploading = phase >= 5 && phase <= 8;
  const done = phase >= 9;
  const progress = uploading ? Math.min(100, (phase - 4) * 28) : done ? 100 : 0;

  const existing = [
    { name: "Q3-roadmap.pdf", size: "1.4 MB", chunks: 184, src: "Notion" },
    { name: "pricing-deck.pptx", size: "3.2 MB", chunks: 312, src: "Drive" },
    { name: "support-faqs.md", size: "42 KB", chunks: 58, src: "GitHub" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2 rounded-xl border border-black/5 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold">Upload knowledge</h4>
          <span className="text-[10px] text-[oklch(0.4_0_0)]">PDF · DOCX · MD · CSV</span>
        </div>
        <div className={`relative grid h-40 place-items-center rounded-xl border-2 border-dashed transition-all duration-300 ${
          dropped ? "border-[oklch(0.68_0.22_40)] bg-[oklch(0.97_0.05_70)]" : "border-black/10 bg-[oklch(0.98_0_0)]"
        }`}>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className={`grid h-10 w-10 place-items-center rounded-xl transition-all ${dropped ? "bg-[oklch(0.68_0.22_40)] text-white scale-110" : "bg-white text-[oklch(0.4_0_0)] border border-black/10"}`}>
              <Upload className="h-5 w-5" />
            </div>
            <div className="text-xs font-semibold">{dropped ? "contract.pdf" : "Drop a file or click to browse"}</div>
            <div className="text-[10px] text-[oklch(0.4_0_0)]">{dropped ? "812 KB" : "Up to 50 MB per file"}</div>
          </div>

          {/* Floating file icon that drops in */}
          <div
            className="pointer-events-none absolute transition-all duration-700 ease-out"
            style={{
              top: dropped ? "50%" : "10%",
              right: dropped ? "50%" : "10%",
              transform: dropped ? "translate(50%, -120%) scale(0.6)" : "translate(0,0) scale(1)",
              opacity: dropped ? 0 : 1,
            }}
          >
            <div className="flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-2 py-1.5 text-[10px] shadow-md">
              <FileText className="h-3.5 w-3.5 text-[oklch(0.6_0.2_25)]" /> contract.pdf
            </div>
          </div>
        </div>

        {(uploading || done) && (
          <div className="mt-3 rounded-lg border border-black/5 bg-[oklch(0.98_0_0)] p-3 animate-fade-in">
            <div className="flex items-center gap-2 text-xs">
              <FileText className="h-4 w-4 text-[oklch(0.6_0.2_25)]" />
              <span className="flex-1 truncate font-medium">contract.pdf</span>
              <span className="tabular-nums text-[10px] text-[oklch(0.4_0_0)]">{progress}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/5">
              <div className="h-full rounded-full bg-[oklch(0.68_0.22_40)] transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[oklch(0.4_0_0)]">
              {done ? (
                <><Check className="h-3 w-3 text-[oklch(0.55_0.18_140)]" /> Indexed · 142 chunks · ready to query</>
              ) : (
                <><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[oklch(0.68_0.22_40)]" /> Extracting text · embedding chunks…</>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-black/5 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold">Recent files</h4>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[oklch(0.68_0.22_40)]" />
        </div>
        <ul className="space-y-2">
          {done && (
            <li className="flex items-center gap-2 rounded-lg border border-[oklch(0.68_0.22_40)]/30 bg-[oklch(0.97_0.05_70)] p-2 animate-fade-in">
              <FileText className="h-4 w-4 text-[oklch(0.6_0.2_25)]" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium">contract.pdf</div>
                <div className="text-[10px] text-[oklch(0.4_0_0)]">812 KB · 142 chunks</div>
              </div>
              <span className="rounded bg-white px-1.5 py-0.5 text-[9px] text-[oklch(0.55_0.18_140)]">New</span>
            </li>
          )}
          {existing.map((f) => (
            <li key={f.name} className="flex items-center gap-2 rounded-lg border border-black/5 p-2">
              <FileText className="h-4 w-4 text-[oklch(0.5_0_0)]" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium">{f.name}</div>
                <div className="text-[10px] text-[oklch(0.4_0_0)]">{f.size} · {f.chunks} chunks</div>
              </div>
              <span className="text-[9px] text-[oklch(0.4_0_0)]">{f.src}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// === AGENTS VIEW: chat-to-build an agent ===
function AgentsView() {
  const tick = useTick(700);
  const cycle = tick % 18;
  const fullPrompt = "Create an agent that summarizes Stripe revenue every Monday at 9am and posts it to #revenue in Slack.";
  const typedLen = Math.min(fullPrompt.length, cycle * 8);
  const typed = fullPrompt.slice(0, typedLen);
  const sent = cycle >= 8;
  const replyLines = [
    "Got it — I'll spin up an agent for that:",
    "  · trigger: every Mon · 9:00 AM",
    "  · query Stripe → invoices.list (last 7d)",
    "  · summarize by segment + delta vs prior week",
    "  · post → slack.#revenue",
    "Ready to deploy?",
  ];
  const visibleReply = sent ? replyLines.slice(0, Math.min(replyLines.length, cycle - 7)) : [];
  const created = cycle >= 14;

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Chat side */}
      <div className="col-span-2 flex h-[320px] flex-col rounded-xl border border-black/5 bg-white">
        <div className="flex items-center justify-between border-b border-black/5 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="grid h-6 w-6 place-items-center rounded-lg bg-[oklch(0.68_0.22_40)] text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div className="text-xs font-semibold">Build an agent</div>
          </div>
          <span className="text-[10px] text-[oklch(0.4_0_0)]">Beevr · gpt-5</span>
        </div>

        <div className="flex-1 space-y-2.5 overflow-hidden p-4 text-xs">
          {sent && (
            <div className="flex justify-end animate-fade-in">
              <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[oklch(0.97_0_0)] px-3 py-2 text-[oklch(0.2_0_0)]">
                {fullPrompt}
              </div>
            </div>
          )}
          {sent && (
            <div className="flex items-start gap-2 animate-fade-in">
              <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-[oklch(0.68_0.22_40)] text-white">
                <Sparkles className="h-3 w-3" />
              </div>
              <div className="min-w-0 flex-1 space-y-0.5 font-mono text-[11px] leading-relaxed text-[oklch(0.2_0_0)]">
                {visibleReply.map((l, i) => (
                  <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>{l}</div>
                ))}
                {visibleReply.length > 0 && visibleReply.length < replyLines.length && (
                  <span className="inline-block h-3 w-1.5 animate-pulse bg-[oklch(0.68_0.22_40)]" />
                )}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-black/5 p-3">
          <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2">
            <Paperclip className="h-3.5 w-3.5 text-[oklch(0.5_0_0)]" />
            <div className="min-w-0 flex-1 text-xs text-[oklch(0.2_0_0)]">
              {sent ? <span className="text-[oklch(0.5_0_0)]">Ask a follow-up…</span> : (
                <>
                  {typed}
                  <span className="inline-block h-3 w-[2px] -mb-0.5 animate-pulse bg-[oklch(0.2_0_0)] align-middle" />
                </>
              )}
            </div>
            <button className={`grid h-7 w-7 place-items-center rounded-lg transition-colors ${typedLen > 0 ? "bg-[oklch(0.68_0.22_40)] text-white" : "bg-[oklch(0.95_0_0)] text-[oklch(0.6_0_0)]"}`}>
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Agent preview */}
      <div className="rounded-xl border border-black/5 bg-white p-4">
        <div className="mb-3 text-xs font-semibold">Workspace agents</div>
        <div className="space-y-2">
          {created && (
            <div className="rounded-lg border-2 border-[oklch(0.68_0.22_40)]/40 bg-[oklch(0.97_0.05_70)] p-3 animate-fade-in shadow-[0_0_0_3px_color-mix(in_oklab,oklch(0.68_0.22_40)_10%,transparent)]">
              <div className="flex items-center gap-2">
                <div className="grid h-7 w-7 place-items-center rounded-lg bg-[oklch(0.68_0.22_40)] text-white">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-semibold">Revenue Digest</div>
                  <div className="text-[10px] text-[oklch(0.4_0_0)]">Mon 9:00 · Stripe → Slack</div>
                </div>
                <span className="rounded bg-white px-1.5 py-0.5 text-[9px] font-medium text-[oklch(0.55_0.18_140)]">New</span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[oklch(0.4_0_0)]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[oklch(0.68_0.22_40)]" /> Deploying…
              </div>
            </div>
          )}
          <AgentRow name="Hiring Pipeline" sub="Daily · Greenhouse → Notion" running />
          <AgentRow name="Support Triage" sub="Realtime · Intercom" />
        </div>
      </div>
    </div>
  );
}

function AgentRow({ name, sub, running }: { name: string; sub: string; running?: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-black/5 p-3">
      <div className="grid h-7 w-7 place-items-center rounded-lg bg-[oklch(0.97_0_0)]">
        <Bot className="h-3.5 w-3.5 text-[oklch(0.4_0_0)]" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-semibold">{name}</div>
        <div className="text-[10px] text-[oklch(0.4_0_0)]">{sub}</div>
      </div>
      <span className={`h-1.5 w-1.5 rounded-full ${running ? "animate-pulse bg-[oklch(0.68_0.22_40)]" : "bg-[oklch(0.85_0_0)]"}`} />
    </div>
  );
}

// === BRAIN VIEW: ask-anything chat with sources ===
function BrainView() {
  const tick = useTick(650);
  const cycle = tick % 16;
  const question = "What's our MRR this month and which segment is growing fastest?";
  const typedLen = Math.min(question.length, cycle * 9);
  const typed = question.slice(0, typedLen);
  const sent = cycle >= 8;
  const answerWords = "MRR is $284k, up 12% MoM. The Mid-market segment is leading growth at +28% — driven by 14 new SaaS customers. Enterprise is flat; SMB churn is down 2pts.".split(" ");
  const shownWords = sent ? answerWords.slice(0, Math.min(answerWords.length, (cycle - 7) * 6)) : [];
  const sources = [
    { name: "Stripe · Invoices", icon: Send, color: "oklch(0.55_0.2_270)" },
    { name: "Hubspot · Deals", icon: Mail, color: "oklch(0.6_0.2_25)" },
    { name: "Q3 Board Doc", icon: FileText, color: "oklch(0.5_0_0)" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2 flex h-[320px] flex-col rounded-xl border border-black/5 bg-white">
        <div className="flex items-center justify-between border-b border-black/5 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="grid h-6 w-6 place-items-center rounded-lg bg-[oklch(0.15_0_0)] text-white">
              <Brain className="h-3.5 w-3.5" />
            </div>
            <div className="text-xs font-semibold">Ask your business</div>
          </div>
          <span className="text-[10px] text-[oklch(0.4_0_0)]">5 sources connected</span>
        </div>

        <div className="flex-1 space-y-2.5 overflow-hidden p-4 text-xs">
          {sent && (
            <div className="flex items-start justify-end gap-2 animate-fade-in">
              <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-[oklch(0.97_0_0)] px-3 py-2">{question}</div>
              <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[oklch(0.65_0.2_40)] text-[10px] font-semibold text-white">A</div>
            </div>
          )}
          {sent && shownWords.length > 0 && (
            <div className="flex items-start gap-2 animate-fade-in">
              <div className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-[oklch(0.15_0_0)] text-white">
                <Brain className="h-3.5 w-3.5" />
              </div>
              <div className="max-w-[85%] leading-relaxed">
                {shownWords.join(" ")}
                {shownWords.length < answerWords.length && (
                  <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-[oklch(0.15_0_0)] align-middle" />
                )}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-black/5 p-3">
          <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2">
            <MessageSquare className="h-3.5 w-3.5 text-[oklch(0.5_0_0)]" />
            <div className="min-w-0 flex-1 text-xs">
              {sent ? <span className="text-[oklch(0.5_0_0)]">Ask a follow-up…</span> : (
                <>
                  {typed}
                  <span className="inline-block h-3 w-[2px] -mb-0.5 animate-pulse bg-[oklch(0.2_0_0)] align-middle" />
                </>
              )}
            </div>
            <button className={`grid h-7 w-7 place-items-center rounded-lg ${typedLen > 0 ? "bg-[oklch(0.15_0_0)] text-white" : "bg-[oklch(0.95_0_0)] text-[oklch(0.6_0_0)]"}`}>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-black/5 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-xs font-semibold">Sources</h4>
          <span className="text-[10px] text-[oklch(0.4_0_0)]">{sent ? "3 used" : "—"}</span>
        </div>
        <div className="space-y-2">
          {sources.map((s, i) => (
            <div
              key={s.name}
              className={`flex items-center gap-2 rounded-lg border p-2 transition-all duration-300 ${
                sent && shownWords.length > i * 4
                  ? "border-[oklch(0.68_0.22_40)]/30 bg-[oklch(0.97_0.05_70)]"
                  : "border-black/5 opacity-60"
              }`}
            >
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-[oklch(0.97_0_0)]">
                <s.icon className="h-3.5 w-3.5" style={{ color: s.color }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium">{s.name}</div>
                <div className="text-[10px] text-[oklch(0.4_0_0)]">cited · 2 chunks</div>
              </div>
              {sent && shownWords.length > i * 4 && (
                <Check className="h-3.5 w-3.5 text-[oklch(0.55_0.18_140)]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
