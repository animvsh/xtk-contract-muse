import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Settings as SettingsIcon, User as UserIcon, LogOut, Save, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/app/settings")({
  component: Settings,
});

function Settings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [pwd, setPwd] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", user.id)
        .maybeSingle();
      if (cancelled) return;
      if (!error && data) {
        setDisplayName(data.display_name ?? "");
        setAvatarUrl(data.avatar_url ?? "");
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function save() {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName || null, avatar_url: avatarUrl || null })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSavedAt(Date.now());
    toast.success("Profile updated");
  }

  async function changePassword() {
    if (pwd.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setPwdSaving(true);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    setPwdSaving(false);
    if (error) return toast.error(error.message);
    setPwd("");
    toast.success("Password updated");
  }

  const initial = (displayName || user?.email || "U").charAt(0).toUpperCase();
  const justSaved = savedAt && Date.now() - savedAt < 2000;

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto px-6 py-8">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[oklch(0.68_0.22_40)]">
        <SettingsIcon className="h-3.5 w-3.5" /> Settings
      </div>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">Profile</h1>
      <p className="mt-1 text-sm text-[oklch(0.4_0_0)]">Manage how you appear in Beevr.</p>

      <section className="mt-8 rounded-2xl border border-black/5 bg-white/70 p-6">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <UserIcon className="h-4 w-4" /> Profile
        </div>

        <div className="mt-5 flex items-center gap-4">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt="Avatar preview"
              className="h-16 w-16 rounded-full border border-black/5 object-cover"
              onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
            />
          ) : (
            <div className="grid h-16 w-16 place-items-center rounded-full bg-[oklch(0.65_0.2_40)] text-xl font-semibold text-white">
              {initial}
            </div>
          )}
          <div className="text-xs text-[oklch(0.45_0_0)]">
            <div className="font-medium text-[oklch(0.25_0_0)]">{user?.email}</div>
            <div className="mt-0.5">Avatar shows your initial when no image is set.</div>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          <Field label="Display name">
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              disabled={loading}
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-[oklch(0.68_0.22_40)] focus:ring-2 focus:ring-[oklch(0.68_0.22_40)]/20"
            />
          </Field>
          <Field label="Avatar URL" hint="Paste a link to a square image (PNG/JPG).">
            <input
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://…"
              disabled={loading}
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-[oklch(0.68_0.22_40)] focus:ring-2 focus:ring-[oklch(0.68_0.22_40)]/20"
            />
          </Field>
          <Field label="Email" hint="Contact support to change your email.">
            <input
              value={user?.email ?? ""}
              disabled
              className="w-full rounded-lg border border-black/10 bg-black/5 px-3 py-2 text-sm text-[oklch(0.4_0_0)]"
            />
          </Field>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          {justSaved && (
            <span className="flex items-center gap-1 text-xs text-emerald-600">
              <Check className="h-3 w-3" /> Saved
            </span>
          )}
          <button
            onClick={save}
            disabled={saving || loading}
            className="clicky inline-flex items-center gap-2 rounded-xl bg-[oklch(0.68_0.22_40)] px-4 py-2 text-sm font-medium text-white shadow-md shadow-[oklch(0.68_0.22_40)]/30 hover:bg-[oklch(0.62_0.22_40)] disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save changes
          </button>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-black/5 bg-white/70 p-6">
        <div className="text-sm font-semibold">Password</div>
        <p className="mt-1 text-xs text-[oklch(0.45_0_0)]">Use at least 8 characters.</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="New password"
            className="flex-1 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-[oklch(0.68_0.22_40)] focus:ring-2 focus:ring-[oklch(0.68_0.22_40)]/20"
          />
          <button
            onClick={changePassword}
            disabled={pwdSaving || pwd.length === 0}
            className="clicky rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium hover:bg-black/5 disabled:opacity-60"
          >
            {pwdSaving ? "Updating…" : "Update password"}
          </button>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-rose-200 bg-rose-50/60 p-6">
        <div className="text-sm font-semibold text-rose-900">Sign out</div>
        <p className="mt-1 text-xs text-rose-700/80">End your session on this device.</p>
        <button
          onClick={() => signOut().then(() => navigate({ to: "/auth" }))}
          className="clicky mt-4 inline-flex items-center gap-2 rounded-xl border border-rose-300 bg-white px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </section>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.4_0_0)]">{label}</span>
        {hint && <span className="text-[10px] text-[oklch(0.5_0_0)]">{hint}</span>}
      </div>
      {children}
    </label>
  );
}
