import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shield, Mail, Phone, Linkedin, Briefcase, Sparkles, Loader2, Search } from "lucide-react";
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
      .filter(Boolean).join(" ").toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
            <Shield className="h-3 w-3 text-[oklch(0.72_0.21_45)]" /> Admin
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">Waitlist</h1>
          <p className="text-sm text-white/60">{rows.length} {rows.length === 1 ? "applicant" : "applicants"}</p>
        </div>
        <div className="relative w-72 max-w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search applicants…"
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 py-2.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-[oklch(0.72_0.21_45)]"
          />
        </div>
      </div>

      {busy ? (
        <div className="flex items-center gap-2 text-sm text-white/60"><Loader2 className="h-4 w-4 animate-spin" /> Loading applicants…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center text-sm text-white/50">
          {rows.length === 0 ? "No waitlist signups yet." : "No matches for that search."}
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((r) => (
            <div key={r.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:bg-white/[0.05]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-[oklch(0.68_0.22_40)] text-sm font-bold text-white">
                    {(r.full_name?.[0] || r.email[0]).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{r.full_name || r.email}</div>
                    <div className="flex items-center gap-1.5 text-xs text-white/50"><Mail className="h-3 w-3" /> {r.email}</div>
                  </div>
                </div>
                <div className="text-xs text-white/40">{new Date(r.created_at).toLocaleString()}</div>
              </div>

              <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                {r.business && (
                  <div className="rounded-lg bg-white/5 p-3">
                    <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/40"><Briefcase className="h-3 w-3" /> Business</div>
                    <div className="text-white/90">{r.business}</div>
                  </div>
                )}
                {r.goal && (
                  <div className="rounded-lg bg-white/5 p-3">
                    <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/40"><Sparkles className="h-3 w-3" /> Goal</div>
                    <div className="text-white/90">{r.goal}</div>
                  </div>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {r.phone && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-white/70"><Phone className="h-3 w-3" /> {r.phone}</span>
                )}
                {r.linkedin && (
                  <a href={r.linkedin.startsWith("http") ? r.linkedin : `https://${r.linkedin}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-white/70 hover:bg-white/10">
                    <Linkedin className="h-3 w-3" /> LinkedIn
                  </a>
                )}
                {r.referral_source && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-white/70">via {r.referral_source}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
