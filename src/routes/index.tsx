import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, Sparkles, Zap, Shield, ArrowRight, Check } from "lucide-react";

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
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Brain className="h-4 w-4" />
            </div>
            <span className="font-semibold">Beevr</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#integrations" className="hover:text-foreground">Integrations</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
          </nav>
          <Link
            to="/app/brain"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Open app
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-24 text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3 text-primary" />
          Now with cloud-hosted agents
        </div>
        <h1 className="mx-auto max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-6xl">
          Your company's <span className="text-primary">second brain</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Connect every tool. Ask anything. Beevr searches across Notion, Slack,
          Gmail and more — and quietly acts on your behalf.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            to="/app/brain"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Try the demo <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#features"
            className="rounded-lg border border-border px-5 py-3 text-sm font-medium hover:bg-muted"
          >
            See how it works
          </a>
        </div>

        {/* Mock app preview */}
        <div className="mx-auto mt-16 max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-[oklch(0.62_0.22_25)]" />
            <span className="h-3 w-3 rounded-full bg-[oklch(0.78_0.16_70)]" />
            <span className="h-3 w-3 rounded-full bg-[oklch(0.72_0.18_145)]" />
            <div className="mx-auto rounded-md bg-muted px-3 py-0.5 text-xs text-muted-foreground">
              app.beevr.io/brain
            </div>
          </div>
          <div className="space-y-3 p-6 text-left">
            <div className="ml-auto w-fit max-w-[80%] rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground">
              Look at the doc about Beevr and send Adithya an employment contract
            </div>
            <div className="rounded-xl border border-border bg-background p-4 text-sm">
              <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-3 w-3 text-primary" /> Thinking…
              </div>
              <ul className="space-y-1 text-muted-foreground">
                <li>✓ Read Beevr doc in Notion</li>
                <li>✓ Found Adithya in contacts</li>
                <li>✓ Drafted contract</li>
                <li className="text-foreground">→ Sending via Gmail…</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border bg-card/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold">Built for teams that move fast</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: Brain, title: "Unified brain", desc: "One search across every doc, channel, and inbox in your stack." },
              { icon: Zap, title: "Cloud agents", desc: "Spin up agents that act on your data — no code, no cron." },
              { icon: Shield, title: "Enterprise-grade", desc: "SOC 2, role-based access, audit logs out of the box." },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-card p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section id="integrations" className="py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-3xl font-bold">Connects to everything</h2>
          <p className="mt-3 text-muted-foreground">Notion · Slack · Gmail · Linear · Drive · GitHub · Figma · 40+ more</p>
          <div className="mt-10 grid grid-cols-3 gap-3 md:grid-cols-6">
            {["Notion","Slack","Gmail","Linear","Drive","GitHub","Figma","Jira","HubSpot","Zoom","Salesforce","Stripe"].map((n) => (
              <div key={n} className="rounded-lg border border-border bg-card px-4 py-6 text-sm font-medium">
                {n}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-border bg-card/30 py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-3xl font-bold">Simple pricing</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              { name: "Team", price: "$20", per: "per user / month", features: ["Unlimited search", "5 connectors", "Up to 10 agents"] },
              { name: "Business", price: "$50", per: "per user / month", features: ["Everything in Team", "Unlimited connectors", "SSO + audit logs"], featured: true },
            ].map((p) => (
              <div key={p.name} className={`rounded-xl border p-6 ${p.featured ? "border-primary bg-accent/30" : "border-border bg-card"}`}>
                <div className="text-sm text-muted-foreground">{p.name}</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{p.price}</span>
                  <span className="text-sm text-muted-foreground">{p.per}</span>
                </div>
                <ul className="mt-6 space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/app/brain"
                  className={`mt-6 inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium ${p.featured ? "bg-primary text-primary-foreground hover:opacity-90" : "border border-border hover:bg-muted"}`}
                >
                  Start free
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        © 2026 Beevr Inc. — Your company's second brain.
      </footer>
    </div>
  );
}
