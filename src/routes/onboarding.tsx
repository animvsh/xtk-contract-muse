import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { ArrowRight, ArrowLeft, Briefcase, Sparkles, Phone, Linkedin, Mail, Lock, Loader2, Check, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Join the waitlist — Beevr" }] }),
  component: Onboarding,
});

const REFERRALS = ["Twitter / X", "LinkedIn", "Friend", "Google", "Other"];

const fieldClass =
  "field w-full rounded-xl border border-black/[0.08] bg-white px-4 py-3 text-[15px] text-[oklch(0.18_0_0)] placeholder:text-[oklch(0.6_0_0)] outline-none transition-[border-color,box-shadow] focus:border-[oklch(0.68_0.22_40)] focus:ring-4 focus:ring-[oklch(0.68_0.22_40)]/12";

const labelClass = "mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[oklch(0.5_0_0)]";

function Onboarding() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [goal, setGoal] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [referral, setReferral] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && session) navigate({ to: "/app" });
  }, [session, loading, navigate]);

  const steps = [
    { label: "You", icon: User },
    { label: "Business", icon: Briefcase },
    { label: "Contact", icon: Phone },
    { label: "Account", icon: Sparkles },
  ];

  const next = () => { setDir(1); setStep((s) => Math.min(s + 1, steps.length - 1)); };
  const back = () => { setDir(-1); setStep((s) => Math.max(s - 1, 0)); };

  const canProceed = () => {
    if (step === 0) return name.trim().length > 0;
    if (step === 1) return business.trim().length > 0 && goal.trim().length > 0;
    if (step === 2) return phone.trim().length > 0 && referral.length > 0;
    return email.includes("@") && password.length >= 6;
  };

  const persistWaitlist = async (userId: string | null, emailVal: string) => {
    await supabase.from("waitlist_submissions").insert({
      user_id: userId,
      email: emailVal,
      full_name: name,
      business,
      goal,
      phone,
      linkedin,
      referral_source: referral,
    });
  };

  const google = async () => {
    setBusy(true);
    try {
      sessionStorage.setItem(
        "beevr-waitlist-draft",
        JSON.stringify({ name, business, goal, phone, linkedin, referral }),
      );
    } catch {}
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/app`,
          data: { display_name: name || email.split("@")[0] },
        },
      });
      if (error) throw error;
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      await persistWaitlist(data.user?.id ?? null, email);
      toast.success("You're on the list!", { description: "We'll be in touch soon." });
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

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[oklch(0.985_0.012_85)] text-[oklch(0.15_0_0)]">
      {/* Soft ambient glows */}
      <div className="pointer-events-none absolute -left-48 -top-48 h-[560px] w-[560px] rounded-full bg-[oklch(0.78_0.18_55)] opacity-[0.18] blur-[160px]" />
      <div className="pointer-events-none absolute -right-48 top-1/3 h-[560px] w-[560px] rounded-full bg-[oklch(0.78_0.18_55)] opacity-[0.14] blur-[160px]" />

      <div className="relative mx-auto flex min-h-screen max-w-[1080px] flex-col px-4 py-5 md:px-8 md:py-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link to="/" className="clicky-sm flex items-center gap-2.5">
            <BrandLogo className="h-9 w-9 object-contain" />
            <span className="text-lg font-bold tracking-tight">Beevr</span>
          </Link>
          <Link
            to="/auth"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-[oklch(0.45_0_0)] transition-colors hover:bg-black/[0.04] hover:text-[oklch(0.15_0_0)]"
          >
            Have an account? <span className="font-semibold text-[oklch(0.62_0.22_40)]">Sign in</span>
          </Link>
        </header>

        {/* Card */}
        <div className="mx-auto mt-8 w-full max-w-[560px] flex-1">
          <div className="overflow-hidden rounded-[24px] border border-black/[0.06] bg-white/80 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.12),0_4px_12px_-4px_rgba(0,0,0,0.06)] backdrop-blur-xl">
            {/* Stepper */}
            <div className="border-b border-black/[0.05] px-6 pt-5 pb-4 md:px-8 md:pt-6">
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.1em] text-[oklch(0.5_0_0)]">
                <span>Step {step + 1} of {steps.length}</span>
                <span className="text-[oklch(0.62_0.22_40)]">{steps[step].label}</span>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      i <= step ? "bg-[oklch(0.68_0.22_40)]" : "bg-black/[0.08]"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <div key={step} className={`px-6 pb-6 pt-7 md:px-8 md:pb-8 md:pt-8 ${dir === 1 ? "step-in-right" : "step-in-left"}`}>
              {step === 0 && (
                <>
                  <h1 className="text-[28px] font-bold tracking-tight md:text-[32px]">Let's get to know you</h1>
                  <p className="mt-2 text-[15px] leading-relaxed text-[oklch(0.45_0_0)]">
                    Beevr is in private beta. Tell us a bit about yourself and we'll reach out when there's a spot.
                  </p>
                  <div className="mt-7">
                    <label className={labelClass}>Your name</label>
                    <input
                      autoFocus
                      type="text"
                      placeholder="Ada Lovelace"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && canProceed() && next()}
                      className={fieldClass}
                    />
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <h1 className="text-[28px] font-bold tracking-tight md:text-[32px]">Tell us what you're building</h1>
                  <p className="mt-2 text-[15px] leading-relaxed text-[oklch(0.45_0_0)]">
                    A quick snapshot helps us tailor your access.
                  </p>
                  <div className="mt-7 space-y-5">
                    <div>
                      <label className={labelClass}>What business do you run?</label>
                      <input
                        autoFocus
                        type="text"
                        placeholder="e.g. SaaS for dentists"
                        value={business}
                        onChange={(e) => setBusiness(e.target.value)}
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>What do you want to do with Beevr?</label>
                      <textarea
                        rows={4}
                        placeholder="Automate revenue reports, build internal agents, …"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className={`${fieldClass} resize-none`}
                      />
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h1 className="text-[28px] font-bold tracking-tight md:text-[32px]">How can we reach you?</h1>
                  <p className="mt-2 text-[15px] leading-relaxed text-[oklch(0.45_0_0)]">
                    We only use this to contact you about your waitlist spot.
                  </p>
                  <div className="mt-7 space-y-5">
                    <div>
                      <label className={labelClass}>Phone number</label>
                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[oklch(0.55_0_0)]" />
                        <input
                          autoFocus
                          type="tel"
                          placeholder="+1 555 123 4567"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className={`${fieldClass} pl-10`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>
                        LinkedIn <span className="ml-1 text-[oklch(0.6_0_0)] normal-case tracking-normal">(optional)</span>
                      </label>
                      <div className="relative">
                        <Linkedin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[oklch(0.55_0_0)]" />
                        <input
                          type="url"
                          placeholder="linkedin.com/in/you"
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                          className={`${fieldClass} pl-10`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>How did you hear about us?</label>
                      <div className="flex flex-wrap gap-2">
                        {REFERRALS.map((r) => {
                          const active = referral === r;
                          return (
                            <button
                              key={r}
                              type="button"
                              onClick={() => setReferral(r)}
                              className={`clicky-sm inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
                                active
                                  ? "border-[oklch(0.68_0.22_40)] bg-[oklch(0.68_0.22_40)] text-white shadow-sm shadow-[oklch(0.68_0.22_40)]/30"
                                  : "border-black/[0.1] bg-white text-[oklch(0.3_0_0)] hover:border-black/25 hover:bg-[oklch(0.98_0_0)]"
                              }`}
                            >
                              {active && <Check className="h-3.5 w-3.5" />}
                              {r}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h1 className="text-[28px] font-bold tracking-tight md:text-[32px]">
                    Almost there{name.trim() ? `, ${name.trim().split(" ")[0]}` : ""}.
                  </h1>
                  <p className="mt-2 text-[15px] leading-relaxed text-[oklch(0.45_0_0)]">
                    Create your account to lock in your spot on the waitlist.
                  </p>

                  <button
                    type="button"
                    onClick={google}
                    disabled={busy}
                    className="clicky mt-6 flex w-full items-center justify-center gap-2.5 rounded-xl border border-black/[0.1] bg-white px-4 py-3 text-sm font-semibold text-[oklch(0.15_0_0)] transition-colors hover:bg-[oklch(0.98_0_0)] disabled:opacity-60"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>

                  <div className="my-5 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.1em] text-[oklch(0.55_0_0)]">
                    <div className="h-px flex-1 bg-black/[0.08]" /> or use email <div className="h-px flex-1 bg-black/[0.08]" />
                  </div>

                  <div className="space-y-3">
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[oklch(0.55_0_0)]" />
                      <input
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`${fieldClass} pl-10`}
                      />
                    </div>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[oklch(0.55_0_0)]" />
                      <input
                        type="password"
                        placeholder="Password (6+ characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && canProceed() && createAccount()}
                        className={`${fieldClass} pl-10`}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="mt-8 flex items-center gap-2.5">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={back}
                    disabled={busy}
                    className="clicky group inline-flex items-center gap-2 rounded-xl border border-black/[0.08] bg-white px-4 py-3 text-sm font-semibold text-[oklch(0.3_0_0)] transition-colors hover:bg-[oklch(0.98_0_0)]"
                  >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" /> Back
                  </button>
                )}
                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={next}
                    disabled={!canProceed()}
                    className="clicky shine group inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[oklch(0.68_0.22_40)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[oklch(0.68_0.22_40)]/30 transition-all hover:bg-[oklch(0.62_0.22_40)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                  >
                    Continue <ArrowRight className="nudge-x h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={createAccount}
                    disabled={!canProceed() || busy}
                    className="clicky shine inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[oklch(0.68_0.22_40)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[oklch(0.68_0.22_40)]/30 transition-all hover:bg-[oklch(0.62_0.22_40)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                  >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    {busy ? "Submitting…" : "Join waitlist"}
                  </button>
                )}
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-[oklch(0.5_0_0)]">
            We review applications weekly and reach out personally.
          </p>
        </div>
      </div>
    </div>
  );
}
