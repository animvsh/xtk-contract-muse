import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ArrowLeft, Brain, Check, Sparkles, Users, Briefcase, Rocket, Building2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Get started — Beevr" }] }),
  component: Onboarding,
});

const ROLES = [
  { id: "founder", label: "Founder", icon: Rocket },
  { id: "ops", label: "Operations", icon: Briefcase },
  { id: "team", label: "Team lead", icon: Users },
  { id: "enterprise", label: "Enterprise", icon: Building2 },
];

const TOOLS = [
  "Notion", "Slack", "Gmail", "Linear", "GitHub", "Drive", "Figma", "Jira",
];

function Onboarding() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [workspace, setWorkspace] = useState("");
  const [role, setRole] = useState<string>("founder");
  const [tools, setTools] = useState<string[]>(["Notion", "Slack"]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && session) navigate({ to: "/app" });
  }, [session, loading, navigate]);

  const steps = ["About you", "Your work", "Your stack", "Create account"];
  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step, steps.length]);

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const toggleTool = (t: string) =>
    setTools((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  const canProceed = () => {
    if (step === 0) return name.trim().length > 0;
    if (step === 1) return workspace.trim().length > 0 && role;
    if (step === 2) return true;
    return email.includes("@") && password.length >= 6;
  };

  const google = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/app",
    });
    if (result.error) {
      toast.error(result.error.message || "Google sign-in failed");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/app" });
  };

  const createAccount = async () => {
    setBusy(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/app`,
          data: {
            display_name: name || email.split("@")[0],
            workspace_name: workspace,
            role,
            tools,
          },
        },
      });
      if (error) throw error;
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      toast.success(`Welcome aboard, ${name.split(" ")[0] || "there"}!`);
      navigate({ to: "/app" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      if (/already registered|already exists|user already/i.test(msg)) {
        toast.error("That email already has an account", {
          description: "Try signing in instead.",
          action: { label: "Sign in", onClick: () => navigate({ to: "/auth" }) },
        });
      } else {
        toast.error(msg);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[oklch(0.04_0_0)] p-3 text-[oklch(0.15_0_0)]">
      <div className="relative overflow-hidden rounded-[24px]">
        {/* Ambient glow matching landing */}
        <div className="pointer-events-none absolute -left-32 top-20 h-[500px] w-[400px] rounded-full bg-[oklch(0.72_0.21_45)] opacity-50 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 top-60 h-[500px] w-[400px] rounded-full bg-[oklch(0.72_0.21_45)] opacity-50 blur-[120px]" />

        <div className="relative mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1100px] items-center justify-center">
          <div className="w-full overflow-hidden rounded-[28px] bg-white ring-1 ring-black/5">
            {/* Top bar */}
            <div className="flex items-center justify-between border-b border-black/5 px-6 py-4 md:px-10">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="grid h-7 w-7 grid-cols-2 gap-0.5">
                  <span className="rounded-full bg-[oklch(0.68_0.22_40)]" />
                  <span className="rounded-full bg-[oklch(0.68_0.22_40)]" />
                  <span className="rounded-full bg-[oklch(0.68_0.22_40)]" />
                  <span className="rounded-full bg-[oklch(0.68_0.22_40)]" />
                </div>
                <span className="text-lg font-bold tracking-tight">Beevr</span>
              </Link>
              <Link to="/auth" className="text-sm font-medium text-[oklch(0.4_0_0)] hover:text-black">
                Already have an account? <span className="font-semibold text-[oklch(0.62_0.22_40)]">Sign in</span>
              </Link>
            </div>

            {/* Progress */}
            <div className="px-6 pt-6 md:px-10">
              <div className="mb-2 flex items-center justify-between text-xs font-medium text-[oklch(0.45_0_0)]">
                <span>Step {step + 1} of {steps.length} — {steps[step]}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[oklch(0.94_0_0)]">
                <div
                  className="h-full rounded-full bg-[oklch(0.68_0.22_40)] transition-[width] duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Body */}
            <div key={step} className="grid gap-8 px-6 py-10 md:grid-cols-[1.1fr_0.9fr] md:px-10 md:py-14 animate-[fadeInUp_220ms_ease-out]">
              <div className="flex flex-col">
                {step === 0 && (
                  <>
                    <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-[oklch(0.4_0_0)]">
                      <Sparkles className="h-3 w-3 text-[oklch(0.68_0.22_40)]" /> Welcome
                    </div>
                    <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
                      Let's build your<br />second brain.
                    </h1>
                    <p className="mt-3 max-w-md text-[oklch(0.4_0_0)]">
                      Beevr connects every tool your team uses into one searchable, agent-ready workspace.
                    </p>
                    <div className="mt-8 space-y-3">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[oklch(0.45_0_0)]">
                        What should we call you?
                      </label>
                      <input
                        autoFocus
                        type="text"
                        placeholder="Ada Lovelace"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && canProceed() && next()}
                        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 text-base outline-none transition focus:border-[oklch(0.68_0.22_40)]"
                      />
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-[oklch(0.4_0_0)]">
                      <Briefcase className="h-3 w-3 text-[oklch(0.68_0.22_40)]" /> Your work
                    </div>
                    <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
                      Set up your<br />workspace.
                    </h1>
                    <p className="mt-3 max-w-md text-[oklch(0.4_0_0)]">
                      Name your workspace and tell us your role so we can tune the brain for you.
                    </p>
                    <div className="mt-8 space-y-5">
                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[oklch(0.45_0_0)]">
                          Workspace name
                        </label>
                        <input
                          autoFocus
                          type="text"
                          placeholder="Acme Inc."
                          value={workspace}
                          onChange={(e) => setWorkspace(e.target.value)}
                          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 text-base outline-none transition focus:border-[oklch(0.68_0.22_40)]"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[oklch(0.45_0_0)]">
                          Your role
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {ROLES.map((r) => {
                            const Icon = r.icon;
                            const active = role === r.id;
                            return (
                              <button
                                key={r.id}
                                type="button"
                                onClick={() => setRole(r.id)}
                                className={`clicky-sm flex items-center gap-2.5 rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                                  active
                                    ? "border-[oklch(0.68_0.22_40)] bg-[oklch(0.98_0.04_70)] text-[oklch(0.62_0.22_40)]"
                                    : "border-black/10 bg-white text-[oklch(0.25_0_0)] hover:border-black/25"
                                }`}
                              >
                                <Icon className="h-4 w-4" />
                                {r.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-[oklch(0.4_0_0)]">
                      <Brain className="h-3 w-3 text-[oklch(0.68_0.22_40)]" /> Your stack
                    </div>
                    <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
                      What do you<br />want connected?
                    </h1>
                    <p className="mt-3 max-w-md text-[oklch(0.4_0_0)]">
                      Pick the tools your team lives in. You can add more later.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-2">
                      {TOOLS.map((t) => {
                        const active = tools.includes(t);
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => toggleTool(t)}
                            className={`clicky-sm inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition ${
                              active
                                ? "border-[oklch(0.68_0.22_40)] bg-[oklch(0.68_0.22_40)] text-white"
                                : "border-black/10 bg-white text-[oklch(0.25_0_0)] hover:border-black/25"
                            }`}
                          >
                            {active && <Check className="h-3.5 w-3.5" />}
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-[oklch(0.4_0_0)]">
                      <Sparkles className="h-3 w-3 text-[oklch(0.68_0.22_40)]" /> Last step
                    </div>
                    <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
                      Almost there,<br />{name.split(" ")[0] || "friend"}.
                    </h1>
                    <p className="mt-3 max-w-md text-[oklch(0.4_0_0)]">
                      Create your account to spin up <span className="font-semibold text-[oklch(0.2_0_0)]">{workspace || "your workspace"}</span>.
                    </p>

                    <button
                      type="button"
                      onClick={google}
                      disabled={busy}
                      className="clicky mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3.5 text-sm font-semibold text-[oklch(0.15_0_0)] hover:bg-[oklch(0.97_0_0)] disabled:opacity-60"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </button>

                    <div className="my-4 flex items-center gap-3 text-xs text-[oklch(0.5_0_0)]">
                      <div className="h-px flex-1 bg-black/10" /> or use email <div className="h-px flex-1 bg-black/10" />
                    </div>

                    <div className="space-y-3">
                      <input
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[oklch(0.68_0.22_40)]"
                      />
                      <input
                        type="password"
                        placeholder="Password (6+ characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && canProceed() && createAccount()}
                        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[oklch(0.68_0.22_40)]"
                      />
                    </div>
                  </>
                )}

                {/* Nav buttons */}
                <div className="mt-8 flex items-center gap-3">
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={back}
                      disabled={busy}
                      className="clicky inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-[oklch(0.25_0_0)] hover:bg-[oklch(0.97_0_0)]"
                    >
                      <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                  )}
                  {step < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={next}
                      disabled={!canProceed()}
                      className="clicky inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[oklch(0.68_0.22_40)] px-5 py-3 text-sm font-semibold text-white hover:bg-[oklch(0.62_0.22_40)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Continue <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={createAccount}
                      disabled={!canProceed() || busy}
                      className="clicky inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[oklch(0.68_0.22_40)] px-5 py-3 text-sm font-semibold text-white hover:bg-[oklch(0.62_0.22_40)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      {busy ? "Creating…" : "Create my brain"}
                    </button>
                  )}
                </div>
              </div>

              {/* Right preview */}
              <div className="hidden md:block">
                <div className="relative h-full overflow-hidden rounded-2xl border border-black/5 bg-[oklch(0.98_0.02_80)] p-6">
                  <div className="pointer-events-none absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-[oklch(0.72_0.21_45)] opacity-25 blur-[80px]" />
                  <div className="relative">
                    <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[oklch(0.5_0_0)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.68_0.22_40)] breathe" />
                      Live preview
                    </div>
                    <div className="rounded-xl border border-black/5 bg-white p-4">
                      <div className="flex items-center gap-2">
                        <div className="grid h-8 w-8 place-items-center rounded-full bg-[oklch(0.68_0.22_40)] text-sm font-bold text-white">
                          {(name.trim()[0] || "?").toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold">{name.trim() || "Your name"}</div>
                          <div className="truncate text-xs text-[oklch(0.5_0_0)]">{workspace.trim() || "Your workspace"}</div>
                        </div>
                      </div>
                      <div className="mt-4 space-y-1.5">
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-[oklch(0.5_0_0)]">Connected</div>
                        {tools.length === 0 ? (
                          <div className="rounded-lg border border-dashed border-black/10 px-3 py-4 text-center text-xs text-[oklch(0.5_0_0)]">
                            Pick some tools →
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {tools.map((t) => (
                              <span key={t} className="rounded-md bg-[oklch(0.97_0_0)] px-2 py-1 text-[11px] font-medium text-[oklch(0.25_0_0)]">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      {[
                        "Indexed 2,450 docs across your tools",
                        "Spinning up your first agent",
                        "Personalizing for " + (role || "you"),
                      ].map((line, i) => (
                        <div
                          key={line}
                          className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2 text-xs text-[oklch(0.3_0_0)] animate-[fadeInUp_300ms_ease-out_both]"
                          style={{ animationDelay: `${i * 120}ms` }}
                        >
                          <Check className="h-3.5 w-3.5 text-[oklch(0.55_0.18_140)]" />
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
