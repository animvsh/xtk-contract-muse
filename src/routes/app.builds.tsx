import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Cpu, DollarSign, Users, Search, TrendingUp, Activity } from "lucide-react";

export const Route = createFileRoute("/app/builds")({
  component: Builds,
});

type Member = {
  name: string;
  email: string;
  runs: number;
  color: string;
};

type BilledAgent = {
  id: string;
  name: string;
  description: string;
  pricingModel: string;
  unitPrice: number; // dollars per run
  monthlyRuns: number;
  monthlyCost: number; // computed
  trend: number; // percent vs last month
  status: "active" | "idle";
  users: Member[];
};

const COLORS = [
  "oklch(0.72 0.18 35)",
  "oklch(0.7 0.16 145)",
  "oklch(0.68 0.18 250)",
  "oklch(0.74 0.16 85)",
  "oklch(0.7 0.18 320)",
  "oklch(0.68 0.18 200)",
];

const AGENTS: BilledAgent[] = [
  {
    id: "a_001",
    name: "Bookstore Sales Summary",
    description: "Pulls daily Shopify sales and posts a digest to Slack.",
    pricingModel: "per run",
    unitPrice: 0.12,
    monthlyRuns: 1840,
    monthlyCost: 220.8,
    trend: 18,
    status: "active",
    users: [
      { name: "Adithya Rao", email: "adithya@beevr.io", runs: 612, color: COLORS[0] },
      { name: "Maya Chen", email: "maya@beevr.io", runs: 488, color: COLORS[1] },
      { name: "Jordan Park", email: "jordan@beevr.io", runs: 410, color: COLORS[2] },
      { name: "Priya Shah", email: "priya@beevr.io", runs: 330, color: COLORS[3] },
    ],
  },
  {
    id: "a_002",
    name: "Customer Health Dashboard",
    description: "Computes churn risk scores nightly across all accounts.",
    pricingModel: "per 1k tokens",
    unitPrice: 0.004,
    monthlyRuns: 92,
    monthlyCost: 184.0,
    trend: 6,
    status: "active",
    users: [
      { name: "Maya Chen", email: "maya@beevr.io", runs: 41, color: COLORS[1] },
      { name: "Sam Whitfield", email: "sam@beevr.io", runs: 33, color: COLORS[4] },
      { name: "Jordan Park", email: "jordan@beevr.io", runs: 18, color: COLORS[2] },
    ],
  },
  {
    id: "a_003",
    name: "Weekly Investor Update",
    description: "Drafts the Friday investor email from KPIs and threads.",
    pricingModel: "per run",
    unitPrice: 1.4,
    monthlyRuns: 16,
    monthlyCost: 22.4,
    trend: -4,
    status: "active",
    users: [
      { name: "Adithya Rao", email: "adithya@beevr.io", runs: 12, color: COLORS[0] },
      { name: "Lena Park", email: "lena@beevr.io", runs: 4, color: COLORS[5] },
    ],
  },
  {
    id: "a_004",
    name: "Complaint Watchdog",
    description: "Watches Zendesk + Twitter for spikes and pings the on-call.",
    pricingModel: "per run",
    unitPrice: 0.08,
    monthlyRuns: 3120,
    monthlyCost: 249.6,
    trend: 32,
    status: "active",
    users: [
      { name: "Priya Shah", email: "priya@beevr.io", runs: 1240, color: COLORS[3] },
      { name: "Sam Whitfield", email: "sam@beevr.io", runs: 980, color: COLORS[4] },
      { name: "Maya Chen", email: "maya@beevr.io", runs: 540, color: COLORS[1] },
      { name: "Jordan Park", email: "jordan@beevr.io", runs: 360, color: COLORS[2] },
    ],
  },
  {
    id: "a_005",
    name: "Sales Call Brief Generator",
    description: "Pre-meeting briefs from CRM + LinkedIn + recent emails.",
    pricingModel: "per run",
    unitPrice: 0.45,
    monthlyRuns: 208,
    monthlyCost: 93.6,
    trend: 11,
    status: "active",
    users: [
      { name: "Jordan Park", email: "jordan@beevr.io", runs: 102, color: COLORS[2] },
      { name: "Adithya Rao", email: "adithya@beevr.io", runs: 64, color: COLORS[0] },
      { name: "Lena Park", email: "lena@beevr.io", runs: 42, color: COLORS[5] },
    ],
  },
  {
    id: "a_006",
    name: "Internal Search Assistant",
    description: "Answers questions across Notion, Drive and Linear.",
    pricingModel: "per 1k tokens",
    unitPrice: 0.003,
    monthlyRuns: 14820,
    monthlyCost: 444.6,
    trend: 24,
    status: "active",
    users: [
      { name: "Maya Chen", email: "maya@beevr.io", runs: 5210, color: COLORS[1] },
      { name: "Adithya Rao", email: "adithya@beevr.io", runs: 4180, color: COLORS[0] },
      { name: "Priya Shah", email: "priya@beevr.io", runs: 2980, color: COLORS[3] },
      { name: "Sam Whitfield", email: "sam@beevr.io", runs: 1490, color: COLORS[4] },
      { name: "Jordan Park", email: "jordan@beevr.io", runs: 960, color: COLORS[2] },
    ],
  },
];

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function formatMoney(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function Builds() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"cost" | "runs" | "users">("cost");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = AGENTS.filter(
      (a) =>
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.users.some((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)),
    );
    return filtered.sort((a, b) => {
      if (sort === "cost") return b.monthlyCost - a.monthlyCost;
      if (sort === "runs") return b.monthlyRuns - a.monthlyRuns;
      return b.users.length - a.users.length;
    });
  }, [query, sort]);

  const totals = useMemo(() => {
    const cost = AGENTS.reduce((s, a) => s + a.monthlyCost, 0);
    const runs = AGENTS.reduce((s, a) => s + a.monthlyRuns, 0);
    const seats = new Set(AGENTS.flatMap((a) => a.users.map((u) => u.email))).size;
    return { cost, runs, seats };
  }, []);

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 overflow-y-auto px-6 py-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[oklch(0.68_0.22_40)]">
            <Cpu className="h-3.5 w-3.5" /> Workspace billing
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Builds</h1>
          <p className="mt-1 text-sm text-[oklch(0.4_0_0)]">
            Every agent you're being billed for, and who in the workspace is using it.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard label="This month" value={formatMoney(totals.cost)} icon={DollarSign} accent="oklch(0.68 0.22 40)" sub="Across all agents" />
        <SummaryCard label="Total runs" value={totals.runs.toLocaleString()} icon={Activity} accent="oklch(0.7 0.16 145)" sub="Last 30 days" />
        <SummaryCard label="Active people" value={String(totals.seats)} icon={Users} accent="oklch(0.68 0.18 250)" sub="Using at least one agent" />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-black/10 bg-white/80 px-3 py-2 shadow-sm focus-within:border-[oklch(0.68_0.22_40)]/40">
          <Search className="h-4 w-4 text-[oklch(0.5_0_0)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search agents or people…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[oklch(0.55_0_0)]"
          />
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-black/10 bg-white/80 p-1 text-xs shadow-sm">
          {(["cost", "runs", "users"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setSort(k)}
              className={`clicky clicky-sm rounded-lg px-3 py-1.5 font-medium capitalize ${
                sort === k
                  ? "bg-[oklch(0.68_0.22_40)] text-white"
                  : "text-[oklch(0.35_0_0)] hover:bg-black/5"
              }`}
            >
              Sort by {k}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3">
        {visible.map((a) => {
          const topRuns = Math.max(...a.users.map((u) => u.runs));
          return (
            <div
              key={a.id}
              className="clicky group rounded-2xl border border-black/5 bg-white/70 p-5 transition-all hover:border-[oklch(0.68_0.22_40)]/30 hover:shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                      Active
                    </span>
                    <span className="rounded-md border border-black/10 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[oklch(0.4_0_0)]">
                      {a.pricingModel}
                    </span>
                  </div>
                  <div className="mt-2 truncate text-base font-semibold">{a.name}</div>
                  <div className="mt-1 text-xs text-[oklch(0.45_0_0)]">{a.description}</div>
                </div>
                <div className="flex shrink-0 flex-col items-end">
                  <div className="text-2xl font-semibold tabular-nums text-[oklch(0.2_0_0)]">
                    {formatMoney(a.monthlyCost)}
                  </div>
                  <div className="text-[11px] text-[oklch(0.5_0_0)]">this month</div>
                  <div
                    className={`mt-1 inline-flex items-center gap-1 text-[11px] font-medium ${
                      a.trend >= 0 ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    <TrendingUp className={`h-3 w-3 ${a.trend < 0 ? "rotate-180" : ""}`} />
                    {a.trend > 0 ? "+" : ""}
                    {a.trend}% vs last month
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 rounded-xl bg-[oklch(0.97_0.02_85)]/70 p-3 text-xs">
                <Stat label="Runs" value={a.monthlyRuns.toLocaleString()} />
                <Stat label="Unit price" value={`${formatMoney(a.unitPrice)} / ${a.pricingModel.replace("per ", "")}`} />
                <Stat label="People using" value={`${a.users.length}`} />
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-wider text-[oklch(0.45_0_0)]">
                  <span>Used by</span>
                  <span>Runs this month</span>
                </div>
                <div className="space-y-2">
                  {a.users.map((u) => {
                    const pct = Math.round((u.runs / topRuns) * 100);
                    return (
                      <div key={u.email} className="flex items-center gap-3">
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white shadow-sm"
                          style={{ background: u.color }}
                        >
                          {initials(u.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2 text-sm">
                            <span className="truncate font-medium text-[oklch(0.2_0_0)]">{u.name}</span>
                            <span className="shrink-0 tabular-nums text-[oklch(0.4_0_0)]">
                              {u.runs.toLocaleString()}
                            </span>
                          </div>
                          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/5">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${pct}%`, background: u.color }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
        {visible.length === 0 && (
          <div className="rounded-2xl border border-dashed border-black/10 bg-white/40 p-10 text-center text-sm text-[oklch(0.45_0_0)]">
            No agents match your search.
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  accent,
  sub,
}: {
  label: string;
  value: string;
  icon: typeof DollarSign;
  accent: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white/70 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-[oklch(0.45_0_0)]">{label}</span>
        <span
          className="flex h-7 w-7 items-center justify-center rounded-lg text-white"
          style={{ background: accent }}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className="mt-2 text-2xl font-semibold tabular-nums text-[oklch(0.2_0_0)]">{value}</div>
      <div className="mt-0.5 text-[11px] text-[oklch(0.5_0_0)]">{sub}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-wider text-[oklch(0.5_0_0)]">{label}</div>
      <div className="mt-0.5 text-sm font-semibold tabular-nums text-[oklch(0.2_0_0)]">{value}</div>
    </div>
  );
}
