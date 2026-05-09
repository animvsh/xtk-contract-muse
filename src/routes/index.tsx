import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, ArrowRight, Check, Sparkles, Zap, Shield } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

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
    <div className="min-h-screen bg-[oklch(0.04_0_0)] text-[oklch(0.15_0_0)]">
      {/* Outer dark frame with side glow */}
      <div className="relative overflow-hidden">
        {/* Orange ambient glow */}
        <div className="pointer-events-none absolute -left-40 top-40 h-[600px] w-[400px] rounded-full bg-[oklch(0.72_0.21_45)] opacity-60 blur-[120px]" />
        <div className="pointer-events-none absolute -right-40 top-80 h-[600px] w-[400px] rounded-full bg-[oklch(0.72_0.21_45)] opacity-60 blur-[120px]" />

        {/* Inner rounded white card */}
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[28px] bg-white shadow-2xl">
          {/* Nav */}
          <header className="flex items-center justify-between px-10 py-8">
            <div className="flex items-center gap-2.5">
              <BrandLogo className="h-9 w-9 object-contain" />
              <span className="text-xl font-bold tracking-tight">Beevr</span>
            </div>
            <nav className="hidden items-center gap-10 text-[15px] font-medium text-[oklch(0.25_0_0)] md:flex">
              <a href="#company" className="hover:text-black">Company</a>
              <a href="#features" className="hover:text-black">Features</a>
              <a href="#pricing" className="hover:text-black">Pricing</a>
              <a href="#contacts" className="hover:text-black">Contacts</a>
            </nav>
            <div className="flex items-center gap-6">
              <Link to="/auth" className="text-[15px] font-medium text-[oklch(0.25_0_0)] hover:text-black">
                Sign in
              </Link>
              <Link
                to="/onboarding"
                className="clicky shine rounded-xl bg-[oklch(0.68_0.22_40)] px-5 py-2.5 text-[15px] font-semibold text-white shadow-lg shadow-[oklch(0.68_0.22_40)]/30 hover:bg-[oklch(0.62_0.22_40)]"
              >
                Join the waitlist
              </Link>
            </div>
          </header>

          {/* Hero */}
          <section className="px-10 pb-20 pt-12 text-center">
            <div className="alive mx-auto inline-flex items-center gap-2.5 rounded-full border border-black/10 bg-white/60 px-3 py-1 text-sm text-[oklch(0.3_0_0)] backdrop-blur">
              <img
                src={ycLogo}
                alt="Y Combinator"
                width={20}
                height={20}
                className="h-5 w-5 rounded-[4px] object-contain"
                loading="eager"
                decoding="sync"
              />
              Not backed by Y Combinator (yet)
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
                <div key={f.title} className="alive cursor-default rounded-2xl border border-black/5 bg-[oklch(0.98_0_0)] p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[oklch(0.97_0.05_70)] text-[oklch(0.62_0.22_40)] transition-transform duration-300 group-hover:scale-110">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{f.title}</h3>
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

function DashboardPreview() {
  return (
    <div className="text-[oklch(0.15_0_0)]">
      {/* Browser bar */}
      <div className="flex items-center gap-3 border-b border-black/5 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[oklch(0.7_0.2_25)]" />
          <span className="h-3 w-3 rounded-full bg-[oklch(0.85_0.18_85)]" />
          <span className="h-3 w-3 rounded-full bg-[oklch(0.75_0.18_145)]" />
        </div>
        <div className="mx-auto rounded-md bg-[oklch(0.95_0_0)] px-4 py-1 text-xs text-[oklch(0.4_0_0)]">app.beevr.io</div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-48 border-r border-black/5 p-4 text-xs">
          <div className="mb-6 flex items-center gap-2 font-bold">
            <div className="grid h-5 w-5 grid-cols-2 gap-0.5">
              <span className="rounded-full bg-[oklch(0.68_0.22_40)]" />
              <span className="rounded-full bg-[oklch(0.68_0.22_40)]" />
              <span className="rounded-full bg-[oklch(0.68_0.22_40)]" />
              <span className="rounded-full bg-[oklch(0.68_0.22_40)]" />
            </div>
            Beevr
          </div>
          <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[oklch(0.5_0_0)]">Main</div>
          <div className="space-y-1">
            <div className="rounded-lg bg-[oklch(0.97_0.05_70)] px-2 py-1.5 font-medium text-[oklch(0.62_0.22_40)]">Brain</div>
            <div className="px-2 py-1.5 text-[oklch(0.4_0_0)]">Team Spaces</div>
            <div className="px-2 py-1.5 text-[oklch(0.4_0_0)]">Docs</div>
            <div className="px-2 py-1.5 text-[oklch(0.4_0_0)]">Agents</div>
            <div className="px-2 py-1.5 text-[oklch(0.4_0_0)]">Connections</div>
          </div>
          <div className="mt-6 mb-2 text-[10px] font-medium uppercase tracking-wider text-[oklch(0.5_0_0)]">Other</div>
          <div className="space-y-1">
            <div className="px-2 py-1.5 text-[oklch(0.4_0_0)]">Settings</div>
            <div className="px-2 py-1.5 text-[oklch(0.4_0_0)]">Get Help</div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5">
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
                    <span className="text-2xl font-bold">2,450</span>
                    <span className="rounded bg-[oklch(0.95_0.06_140)] px-1.5 py-0.5 text-[9px] text-[oklch(0.45_0.18_140)]">↑ 36%</span>
                  </div>
                </div>
                <div className="rounded-lg border border-black/5 p-3">
                  <div className="text-[10px] text-[oklch(0.4_0_0)]">Queries</div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-bold">1,320</span>
                    <span className="rounded bg-[oklch(0.95_0.06_140)] px-1.5 py-0.5 text-[9px] text-[oklch(0.45_0.18_140)]">↑ 18%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-black/5 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold">Activity</h4>
              </div>
              <div className="flex h-24 items-end gap-1.5">
                {[40, 60, 50, 80, 95, 65, 70].map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-sm ${i === 4 ? "bg-[oklch(0.68_0.22_40)]" : "bg-[oklch(0.92_0_0)]"}`}
                    style={{ height: `${h}%` }}
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
                {[
                  ["Adithya Pradeep", "created Beevr Hiring Doc", "Notion", "Synced"],
                  ["Sarah Chen", "merged PR #482", "GitHub", "Synced"],
                  ["Sales Digest", "posted weekly summary", "Agent", "Pending"],
                ].map(([who, what, src, status], i) => (
                  <div key={i} className="grid grid-cols-4 items-center border-t border-black/5 py-2 first:border-0">
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
        </div>
      </div>
    </div>
  );
}
