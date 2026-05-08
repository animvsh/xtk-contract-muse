import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

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
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && session) navigate({ to: "/app" });
  }, [session, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        toast.success("Check your email to confirm your account");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/app" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/app` });
    if (result.error) {
      toast.error("Google sign-in failed");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/app" });
  };

  return (
    <div className="min-h-screen bg-[oklch(0.04_0_0)] p-3">
      <div className="pointer-events-none fixed -left-40 top-40 h-[600px] w-[400px] rounded-full bg-[oklch(0.72_0.21_45)] opacity-40 blur-[120px]" />
      <div className="pointer-events-none fixed -right-40 top-80 h-[600px] w-[400px] rounded-full bg-[oklch(0.72_0.21_45)] opacity-40 blur-[120px]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1500px] items-center justify-center overflow-hidden rounded-[24px] bg-gradient-to-b from-white via-[oklch(0.97_0.04_85)] to-[oklch(0.93_0.1_75)] p-6 shadow-2xl">
        <div className="w-full max-w-sm rounded-3xl border border-black/5 bg-white/80 p-8 backdrop-blur">
          <Link to="/" className="mb-6 flex items-center gap-2.5">
            <div className="grid h-7 w-7 grid-cols-2 gap-0.5">
              <span className="rounded-full bg-[oklch(0.68_0.22_40)]" />
              <span className="rounded-full bg-[oklch(0.68_0.22_40)]" />
              <span className="rounded-full bg-[oklch(0.68_0.22_40)]" />
              <span className="rounded-full bg-[oklch(0.68_0.22_40)]" />
            </div>
            <span className="text-lg font-bold tracking-tight">Beevr</span>
          </Link>

          <h1 className="text-2xl font-bold tracking-tight">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-[oklch(0.45_0_0)]">
            {mode === "signin" ? "Sign in to your second brain" : "Get started with Beevr"}
          </p>

          <button
            onClick={google}
            disabled={busy}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium hover:bg-black/[0.02] disabled:opacity-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-[oklch(0.5_0_0)]">
            <div className="h-px flex-1 bg-black/10" /> or <div className="h-px flex-1 bg-black/10" />
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <input
                type="text"
                placeholder="Display name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[oklch(0.68_0.22_40)]"
              />
            )}
            <input
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[oklch(0.68_0.22_40)]"
            />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[oklch(0.68_0.22_40)]"
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-[oklch(0.68_0.22_40)] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[oklch(0.68_0.22_40)]/30 hover:bg-[oklch(0.62_0.22_40)] disabled:opacity-50"
            >
              {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-[oklch(0.45_0_0)]">
            {mode === "signin" ? "New to Beevr?" : "Already have an account?"}{" "}
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="font-semibold text-[oklch(0.55_0.2_40)] hover:underline"
            >
              {mode === "signin" ? "Create account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
