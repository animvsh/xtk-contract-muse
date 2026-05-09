import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Shield,
  Mail,
  Phone,
  Linkedin,
  Briefcase,
  Sparkles,
  Loader2,
  Search,
  Users,
  TrendingUp,
  Calendar,
  Download,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

const ADMIN_EMAIL = "aalang@ucsc.edu";

type Submission = {
  id: string;
  email: string;
  full_name: string | null;
  business: string | null;
  goal: string | null;
  phone: string | null;
  linkedin: string | null;
  referral_source: string | null;
  created_at: string;
};

export const Route = createFileRoute("/app/admin")({
  head: () => ({ meta: [{ title: "Admin — Waitlist" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Submission[]>([]);
  const [busy, setBusy] = useState(true);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Submission | null>(null);

  useEffect(() => {
    if (!loading && (!user || user.email?.toLowerCase() !== ADMIN_EMAIL)) {
      navigate({ to: "/app" });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL) return;
    (async () => {
      setBusy(true);
      const { data, error } = await supabase
        .from("waitlist_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setRows(data as Submission[]);
      setBusy(false);
    })();
  }, [user]);

  const filtered = rows.filter((r) => {
    if (!q) return true;
    const hay = [r.email, r.full_name, r.business, r.goal, r.phone, r.linkedin, r.referral_source]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  const stats = useMemo(() => {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const last7 = rows.filter((r) => now - new Date(r.created_at).getTime() < 7 * day).length;
    const last24 = rows.filter((r) => now - new Date(r.created_at).getTime() < day).length;
    const withBusiness = rows.filter((r) => r.business).length;
    return { total: rows.length, last7, last24, withBusiness };
  }, [rows]);

  const exportCsv = () => {
    const headers = ["Created", "Name", "Email", "Business", "Goal", "Phone", "LinkedIn", "Referral"];
    const escape = (v: string | null) => `"${(v ?? "").replace(/"/g, '""')}"`;
    const lines = [
      headers.join(","),
      ...rows.map((r) =>
        [
          new Date(r.created_at).toISOString(),
          r.full_name,
          r.email,
          r.business,
          r.goal,
          r.phone,
          r.linkedin,
          r.referral_source,
        ]
          .map(escape)
          .join(","),
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto h-full w-full max-w-6xl overflow-y-auto px-4 py-8 md:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.68_0.22_40)]/20 bg-[oklch(0.68_0.22_40)]/10 px-3 py-1 text-xs font-semibold text-[oklch(0.55_0.22_40)]">
            <Shield className="h-3 w-3" /> Admin
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[oklch(0.18_0_0)]">Waitlist applicants</h1>
          <p className="mt-1 text-sm text-[oklch(0.45_0_0)]">
            Everyone who applied to join Beevr. Click any row to see their full answers.
          </p>
        </div>
        <button
          onClick={exportCsv}
          disabled={rows.length === 0}
          className="clicky inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-[oklch(0.2_0_0)] shadow-sm hover:bg-[oklch(0.97_0_0)] disabled:opacity-50"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard icon={Users} label="Total" value={stats.total} accent="oklch(0.68 0.22 40)" />
        <StatCard icon={TrendingUp} label="Last 7 days" value={stats.last7} accent="oklch(0.7 0.16 145)" />
        <StatCard icon={Calendar} label="Last 24h" value={stats.last24} accent="oklch(0.68 0.18 250)" />
        <StatCard icon={Briefcase} label="With business" value={stats.withBusiness} accent="oklch(0.74 0.16 85)" />
      </div>

      <div className="mb-4 relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[oklch(0.5_0_0)]" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, email, business, goal…"
          className="w-full rounded-xl border border-black/10 bg-white py-3 pl-10 pr-3 text-sm text-[oklch(0.2_0_0)] shadow-sm outline-none placeholder:text-[oklch(0.55_0_0)] focus:border-[oklch(0.68_0.22_40)]/40"
        />
      </div>

      {busy ? (
        <div className="flex items-center gap-2 text-sm text-[oklch(0.45_0_0)]">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading applicants…
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 bg-white/50 p-12 text-center text-sm text-[oklch(0.45_0_0)]">
          {rows.length === 0 ? "No waitlist signups yet." : "No matches for that search."}
        </div>
      ) : (
        <div className="grid gap-2">
          {filtered.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelected(r)}
              className="clicky group flex w-full items-center gap-4 rounded-2xl border border-black/5 bg-white p-4 text-left shadow-sm transition hover:border-[oklch(0.68_0.22_40)]/30 hover:shadow-md"
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[oklch(0.68_0.22_40)] text-sm font-bold text-white shadow-sm">
                {(r.full_name?.[0] || r.email[0]).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="truncate font-semibold text-[oklch(0.18_0_0)]">
                    {r.full_name || r.email.split("@")[0]}
                  </div>
                  {r.business && (
                    <span className="hidden shrink-0 rounded-md bg-[oklch(0.97_0.02_85)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[oklch(0.45_0.05_60)] sm:inline">
                      {r.business.slice(0, 24)}{r.business.length > 24 ? "…" : ""}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 flex items-center gap-2 truncate text-xs text-[oklch(0.45_0_0)]">
                  <Mail className="h-3 w-3 shrink-0" /> <span className="truncate">{r.email}</span>
                </div>
              </div>
              <div className="hidden shrink-0 flex-col items-end gap-0.5 text-[11px] text-[oklch(0.5_0_0)] sm:flex">
                <span>{new Date(r.created_at).toLocaleDateString()}</span>
                <span className="text-[10px]">{new Date(r.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-[oklch(0.55_0_0)] transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>
      )}

      {selected && <DetailDrawer s={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[oklch(0.45_0_0)]">{label}</span>
        <span className="grid h-7 w-7 place-items-center rounded-lg text-white" style={{ background: accent }}>
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className="mt-2 text-2xl font-semibold tabular-nums text-[oklch(0.18_0_0)]">{value}</div>
    </div>
  );
}

function DetailDrawer({ s, onClose }: { s: Submission; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 animate-[fadeIn_150ms_ease-out]" />
      <div
        className="relative flex h-full w-full max-w-lg flex-col overflow-y-auto bg-white shadow-2xl animate-[slideInRight_200ms_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-black/5 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[oklch(0.68_0.22_40)] text-sm font-bold text-white">
              {(s.full_name?.[0] || s.email[0]).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-[oklch(0.18_0_0)]">{s.full_name || s.email}</div>
              <div className="text-xs text-[oklch(0.5_0_0)]">
                Applied {new Date(s.created_at).toLocaleString()}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[oklch(0.4_0_0)] hover:bg-black/5"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4 p-6">
          <Field icon={Mail} label="Email" value={s.email} href={`mailto:${s.email}`} />
          {s.phone && <Field icon={Phone} label="Phone" value={s.phone} href={`tel:${s.phone}`} />}
          {s.linkedin && (
            <Field
              icon={Linkedin}
              label="LinkedIn"
              value={s.linkedin}
              href={s.linkedin.startsWith("http") ? s.linkedin : `https://${s.linkedin}`}
              external
            />
          )}
          {s.business && <LongField icon={Briefcase} label="Business" value={s.business} />}
          {s.goal && <LongField icon={Sparkles} label="Goal" value={s.goal} />}
          {s.referral_source && <Field icon={Users} label="Referral source" value={s.referral_source} />}
        </div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  href,
  external,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <>
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[oklch(0.45_0_0)]">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="mt-1 flex items-center gap-1.5 text-sm text-[oklch(0.18_0_0)]">
        <span className="truncate">{value}</span>
        {external && <ExternalLink className="h-3 w-3 text-[oklch(0.5_0_0)]" />}
      </div>
    </>
  );
  return href ? (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel="noreferrer"
      className="rounded-xl border border-black/5 bg-[oklch(0.98_0_0)] p-3 transition hover:border-[oklch(0.68_0.22_40)]/30 hover:bg-white"
    >
      {content}
    </a>
  ) : (
    <div className="rounded-xl border border-black/5 bg-[oklch(0.98_0_0)] p-3">{content}</div>
  );
}

function LongField({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/5 bg-[oklch(0.98_0_0)] p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[oklch(0.45_0_0)]">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-[oklch(0.18_0_0)]">{value}</div>
    </div>
  );
}
