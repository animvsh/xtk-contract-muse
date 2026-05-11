import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Settings as SettingsIcon, User as UserIcon, LogOut, Save, Loader2, Check, Building2, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useWorkspaces, type Workspace } from "@/hooks/use-workspaces";

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

      <WorkspacesSection />

      <MembersSection />

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

const COLOR_PRESETS = [
  "oklch(0.68 0.22 40)",
  "oklch(0.7 0.18 145)",
  "oklch(0.65 0.2 250)",
  "oklch(0.72 0.18 300)",
  "oklch(0.75 0.18 90)",
  "oklch(0.6 0.22 20)",
];

function WorkspacesSection() {
  const { workspaces, current, switchTo, createWorkspace, removeWorkspace, renameWorkspace } = useWorkspaces();
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({ name: "", company: "", industry: "", color: COLOR_PRESETS[0] });

  function handleCreate() {
    if (!draft.name.trim()) {
      toast.error("Workspace name is required");
      return;
    }
    createWorkspace({
      name: draft.name.trim(),
      company: draft.company.trim(),
      industry: draft.industry.trim(),
      color: draft.color,
    });
    toast.success("Workspace created");
    setDraft({ name: "", company: "", industry: "", color: COLOR_PRESETS[0] });
    setCreating(false);
  }

  return (
    <section className="mt-6 rounded-2xl border border-black/5 bg-white/70 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Building2 className="h-4 w-4" /> Workspaces
        </div>
        <button
          onClick={() => setCreating((v) => !v)}
          className="clicky inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-medium hover:bg-black/5"
        >
          <Plus className="h-3.5 w-3.5" /> New workspace
        </button>
      </div>
      <p className="mt-1 text-xs text-[oklch(0.45_0_0)]">Manage your workspaces, switch the active one, or remove ones you no longer need.</p>

      {creating && (
        <div className="mt-4 rounded-xl border border-dashed border-black/15 bg-white/80 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name">
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="Acme Workspace"
                className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-[oklch(0.68_0.22_40)] focus:ring-2 focus:ring-[oklch(0.68_0.22_40)]/20"
              />
            </Field>
            <Field label="Company">
              <input
                value={draft.company}
                onChange={(e) => setDraft({ ...draft, company: e.target.value })}
                placeholder="Acme Inc."
                className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-[oklch(0.68_0.22_40)] focus:ring-2 focus:ring-[oklch(0.68_0.22_40)]/20"
              />
            </Field>
            <Field label="Industry">
              <input
                value={draft.industry}
                onChange={(e) => setDraft({ ...draft, industry: e.target.value })}
                placeholder="SaaS, Retail, …"
                className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-[oklch(0.68_0.22_40)] focus:ring-2 focus:ring-[oklch(0.68_0.22_40)]/20"
              />
            </Field>
            <Field label="Accent color">
              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setDraft({ ...draft, color: c })}
                    className="h-7 w-7 rounded-full border-2"
                    style={{ background: c, borderColor: draft.color === c ? "black" : "transparent" }}
                    aria-label={c}
                  />
                ))}
              </div>
            </Field>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setCreating(false)} className="clicky rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-medium hover:bg-black/5">Cancel</button>
            <button onClick={handleCreate} className="clicky rounded-lg bg-[oklch(0.68_0.22_40)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[oklch(0.62_0.22_40)]">Create workspace</button>
          </div>
        </div>
      )}

      <ul className="mt-4 divide-y divide-black/5 rounded-xl border border-black/5">
        {workspaces.map((w) => (
          <WorkspaceRow
            key={w.id}
            workspace={w}
            isCurrent={w.id === current?.id}
            canDelete={workspaces.length > 1}
            onSwitch={() => switchTo(w.id)}
            onSave={(patch) => {
              renameWorkspace(w.id, patch);
              toast.success("Workspace updated");
            }}
            onDelete={() => {
              removeWorkspace(w.id);
              toast.success("Workspace removed");
            }}
          />
        ))}
      </ul>
    </section>
  );
}

function WorkspaceRow({
  workspace,
  isCurrent,
  canDelete,
  onSwitch,
  onSave,
  onDelete,
}: {
  workspace: Workspace;
  isCurrent: boolean;
  canDelete: boolean;
  onSwitch: () => void;
  onSave: (patch: Partial<Pick<Workspace, "name" | "company" | "industry" | "color">>) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(workspace.name);
  const [company, setCompany] = useState(workspace.company);
  const [industry, setIndustry] = useState(workspace.industry);
  const [color, setColor] = useState(workspace.color);
  const [confirmDel, setConfirmDel] = useState(false);

  useEffect(() => {
    setName(workspace.name);
    setCompany(workspace.company);
    setIndustry(workspace.industry);
    setColor(workspace.color);
  }, [workspace.id, workspace.name, workspace.company, workspace.industry, workspace.color]);

  return (
    <li className="p-4">
      <div className="flex items-start gap-3">
        <span className="mt-1 inline-block h-8 w-8 flex-shrink-0 rounded-lg" style={{ background: color }} />
        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="grid gap-2 sm:grid-cols-2">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-[oklch(0.68_0.22_40)]" />
              <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" className="rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-[oklch(0.68_0.22_40)]" />
              <input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Industry" className="rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-[oklch(0.68_0.22_40)]" />
              <div className="flex flex-wrap items-center gap-1.5">
                {COLOR_PRESETS.map((c) => (
                  <button key={c} type="button" onClick={() => setColor(c)} className="h-6 w-6 rounded-full border-2" style={{ background: c, borderColor: color === c ? "black" : "transparent" }} aria-label={c} />
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-semibold">{workspace.name}</span>
                {isCurrent && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                    <CheckCircle2 className="h-3 w-3" /> Active
                  </span>
                )}
              </div>
              <div className="mt-0.5 truncate text-xs text-[oklch(0.45_0_0)]">
                {[workspace.company, workspace.industry].filter(Boolean).join(" · ") || "No company / industry set"}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-shrink-0 items-center gap-1.5">
          {!isCurrent && !editing && (
            <button onClick={onSwitch} className="clicky rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-xs font-medium hover:bg-black/5">
              Switch
            </button>
          )}
          {editing ? (
            <>
              <button
                onClick={() => {
                  if (!name.trim()) return toast.error("Name is required");
                  onSave({ name: name.trim(), company: company.trim(), industry: industry.trim(), color });
                  setEditing(false);
                }}
                className="clicky rounded-lg bg-[oklch(0.68_0.22_40)] px-2.5 py-1.5 text-xs font-medium text-white hover:bg-[oklch(0.62_0.22_40)]"
              >
                Save
              </button>
              <button onClick={() => setEditing(false)} className="clicky rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-xs font-medium hover:bg-black/5">
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="clicky rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-xs font-medium hover:bg-black/5">
              Edit
            </button>
          )}
          {canDelete && !editing && (
            confirmDel ? (
              <>
                <button onClick={onDelete} className="clicky inline-flex items-center gap-1 rounded-lg bg-rose-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-rose-700">
                  <Trash2 className="h-3 w-3" /> Confirm
                </button>
                <button onClick={() => setConfirmDel(false)} className="clicky rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-xs font-medium hover:bg-black/5">
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setConfirmDel(true)} className="clicky inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50">
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            )
          )}
        </div>
      </div>
    </li>
  );
}
