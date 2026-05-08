import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Cloud, CheckCircle2, Loader2, AlertTriangle, XCircle, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/app/builds")({
  component: Builds,
});

type BuildStatus = "building" | "ready" | "approved" | "failed" | "cancelled";
type BuildKind = "Agent" | "Tool" | "API" | "Dashboard";

type Build = {
  id: string;
  name: string;
  kind: BuildKind;
  status: BuildStatus;
  source: string;
  test: "passed" | "failed" | "running" | "—";
  progress?: string;
  when: string;
};

const BUILDS: Build[] = [
  {
    id: "b_001",
    name: "Bookstore Sales Summary Agent",
    kind: "Agent",
    status: "ready",
    source: "Home chat",
    test: "passed",
    when: "Today, 14:02",
  },
  {
    id: "b_002",
    name: "Customer Health Dashboard",
    kind: "Tool",
    status: "building",
    source: "OpenCode (Support key)",
    test: "running",
    progress: "Running tests · step 4 of 6",
    when: "Today, 13:48",
  },
  {
    id: "b_003",
    name: "Weekly Investor Update",
    kind: "Tool",
    status: "approved",
    source: "Home chat",
    test: "passed",
    when: "Yesterday",
  },
  {
    id: "b_004",
    name: "Complaint Watchdog Agent",
    kind: "Agent",
    status: "ready",
    source: "Brain chat",
    test: "passed",
    when: "Yesterday",
  },
  {
    id: "b_005",
    name: "Sales Call Brief Generator",
    kind: "Tool",
    status: "failed",
    source: "Claude Code (Sales key)",
    test: "failed",
    when: "2 days ago",
  },
  {
    id: "b_006",
    name: "Internal Search Assistant",
    kind: "Dashboard",
    status: "approved",
    source: "Home chat",
    test: "passed",
    when: "3 days ago",
  },
];

const FILTERS = ["All", "Building", "Ready for review", "Approved", "Failed", "Agents", "Tools", "Dashboards"] as const;

const STATUS_META: Record<BuildStatus, { label: string; icon: typeof CheckCircle2; tone: string }> = {
  building: { label: "Building", icon: Loader2, tone: "bg-amber-500/15 text-amber-700 border-amber-500/20" },
  ready: { label: "Ready for review", icon: CheckCircle2, tone: "bg-primary/15 text-primary border-primary/20" },
  approved: { label: "Approved", icon: CheckCircle2, tone: "bg-emerald-500/15 text-emerald-700 border-emerald-500/20" },
  failed: { label: "Failed", icon: XCircle, tone: "bg-rose-500/15 text-rose-700 border-rose-500/20" },
  cancelled: { label: "Cancelled", icon: AlertTriangle, tone: "bg-muted text-muted-foreground border-border" },
};

function matches(b: Build, f: (typeof FILTERS)[number]) {
  if (f === "All") return true;
  if (f === "Building") return b.status === "building";
  if (f === "Ready for review") return b.status === "ready";
  if (f === "Approved") return b.status === "approved";
  if (f === "Failed") return b.status === "failed";
  if (f === "Agents") return b.kind === "Agent";
  if (f === "Tools") return b.kind === "Tool";
  if (f === "Dashboards") return b.kind === "Dashboard";
  return true;
}

function Builds() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const visible = BUILDS.filter((b) => matches(b, filter));

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 overflow-y-auto px-6 py-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[oklch(0.68_0.22_40)]">
            <Cloud className="h-3.5 w-3.5" /> Cloud Builds
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Builds</h1>
          <p className="mt-1 text-sm text-[oklch(0.4_0_0)]">
            Everything Beevr is building, testing, or hosting in the cloud.
          </p>
        </div>
        <Link
          to="/app/brain"
          className="clicky inline-flex items-center gap-2 rounded-xl bg-[oklch(0.68_0.22_40)] px-4 py-2 text-sm font-medium text-white shadow-md shadow-[oklch(0.68_0.22_40)]/30 hover:bg-[oklch(0.62_0.22_40)]"
        >
          <Cloud className="h-4 w-4" /> New cloud build
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`clicky clicky-sm rounded-full border px-3 py-1.5 text-xs font-medium ${
              filter === f
                ? "border-[oklch(0.68_0.22_40)] bg-[oklch(0.68_0.22_40)] text-white"
                : "border-black/10 bg-white/70 text-[oklch(0.3_0_0)] hover:bg-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3">
        {visible.map((b) => {
          const meta = STATUS_META[b.status];
          const Icon = meta.icon;
          return (
            <div
              key={b.id}
              className="clicky group rounded-2xl border border-black/5 bg-white/70 p-5 hover:border-[oklch(0.68_0.22_40)]/30 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md border border-black/10 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[oklch(0.4_0_0)]">
                      {b.kind}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${meta.tone}`}
                    >
                      <Icon className={`h-3 w-3 ${b.status === "building" ? "animate-spin" : ""}`} />
                      {meta.label}
                    </span>
                  </div>
                  <div className="mt-2 truncate text-base font-semibold">{b.name}</div>
                  <div className="mt-1 text-xs text-[oklch(0.45_0_0)]">
                    From {b.source} · Test {b.test} · {b.when}
                  </div>
                  {b.progress && (
                    <div className="mt-2 text-xs text-amber-700">{b.progress}</div>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {b.status === "ready" && (
                    <button className="clicky clicky-sm rounded-lg bg-[oklch(0.68_0.22_40)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[oklch(0.62_0.22_40)]">
                      Approve
                    </button>
                  )}
                  {b.status === "building" && (
                    <button className="clicky clicky-sm rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs hover:bg-black/5">
                      Cancel
                    </button>
                  )}
                  <button className="clicky clicky-sm flex items-center gap-1 rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs hover:bg-black/5">
                    Open <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {visible.length === 0 && (
          <div className="rounded-2xl border border-dashed border-black/10 bg-white/40 p-10 text-center text-sm text-[oklch(0.45_0_0)]">
            No builds match this filter.
          </div>
        )}
      </div>
    </div>
  );
}
