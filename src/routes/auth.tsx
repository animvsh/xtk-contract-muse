import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

const inputClass =
  "auth-input w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground outline-none transition-[border-color,box-shadow,transform] placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15 disabled:opacity-50";
const softButtonClass =
  "clicky w-full rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-sm hover:border-primary/35 hover:bg-secondary/50 focus:outline-none focus:ring-4 focus:ring-primary/15 disabled:pointer-events-none disabled:opacity-50";
const primaryButtonClass =
  "clicky auth-primary-button w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:pointer-events-none disabled:opacity-60";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Beevr" }] }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && session) navigate({ to: "/app" });
  }, [session, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
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
        toast.success("Account created — you're in");
        navigate({ to: "/app" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/app" });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      if (mode === "signin" && /invalid login credentials/i.test(msg)) {
        setNotice(
          "No password on file for this email. If you signed up with Google, use Continue with Google. Otherwise, reset your password to set a new one.",
        );
        toast.error("Can't sign in with that password", {
          description: "This email may have been created with Google. Try Continue with Google or reset your password.",
          action: { label: "Use Google", onClick: () => void google() },
          duration: 8000,
        });
      } else if (/email not confirmed/i.test(msg)) {
        setNotice(
          "Email confirmation is now turned off. Try creating the account again or reset your password.",
        );
        toast.error("Try creating the account again");
      } else if (/already registered|already exists|user already/i.test(msg)) {
        setMode("signin");
        setNotice(
          "That email already has an account. If you signed up with Google, use Continue with Google. Otherwise, sign in or reset your password.",
        );
        toast.message("Account already exists", {
          description: "Try Continue with Google, or reset your password to set a new one.",
          action: { label: "Use Google", onClick: () => void google() },
          duration: 8000,
        });
      } else {
        toast.error(msg);
      }
    } finally {
      setBusy(false);
    }
  };

  const resetPassword = async () => {
    if (!email) {
      toast.error("Enter your email first");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setNotice("Password reset email sent. Open it, set a new password, then sign in.");
    toast.success("Password reset email sent");
  };

  const google = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error(result.error.message || "Google sign-in failed");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/app" });
  };

  return (
    <div className="min-h-screen bg-foreground p-3 text-foreground">
      <div className="relative mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1500px] items-center justify-center overflow-hidden rounded-[24px] border border-primary/10 bg-gradient-to-b from-card via-background to-secondary p-4 shadow-2xl sm:p-6">
        <div className="auth-card w-full max-w-sm rounded-3xl border border-border bg-card/90 p-7 shadow-2xl shadow-primary/10 backdrop-blur sm:p-8">
          <Link
            to="/"
            className="clicky mb-6 flex w-fit items-center gap-2.5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/15"
          >
            <div className="grid h-7 w-7 grid-cols-2 gap-0.5">
              <span className="rounded-full bg-primary" />
              <span className="rounded-full bg-primary" />
              <span className="rounded-full bg-primary" />
              <span className="rounded-full bg-primary" />
            </div>
            <span className="text-lg font-bold tracking-tight">Beevr</span>
          </Link>

          <h1 className="text-2xl font-bold tracking-tight">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin" ? "Sign in to your second brain" : "Get started with Beevr"}
          </p>
          {notice && (
            <div className="animate-pop mt-4 rounded-xl border border-primary/25 bg-accent/60 px-4 py-3 text-sm font-medium text-accent-foreground">
              {notice}
            </div>
          )}

          <button
            onClick={google}
            disabled={busy}
            className={`${softButtonClass} mt-6 flex items-center justify-center gap-2`}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <input
                type="text"
                placeholder="Display name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            )}
            <input
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
            <button
              type="submit"
              disabled={busy}
              className={`${primaryButtonClass} flex items-center justify-center gap-2`}
            >
              {busy && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/35 border-t-primary-foreground" />
              )}
              {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>
          {mode === "signin" && (
            <button
              type="button"
              onClick={resetPassword}
              disabled={busy}
              className="clicky mt-3 w-full rounded-lg py-2 text-center text-xs font-semibold text-primary hover:bg-primary/10 focus:outline-none focus:ring-4 focus:ring-primary/15 disabled:pointer-events-none disabled:opacity-50"
            >
              Forgot password?
            </button>
          )}

          <p className="mt-4 text-center text-xs text-muted-foreground">
            {mode === "signin" ? "New to Beevr?" : "Already have an account?"}{" "}
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="clicky rounded-md px-1 py-0.5 font-semibold text-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {mode === "signin" ? "Create account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
