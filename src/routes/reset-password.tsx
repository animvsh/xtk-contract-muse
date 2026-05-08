import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password — Beevr" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setReady(Boolean(data.session)));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated");
    navigate({ to: "/app" });
  };

  return (
    <div className="min-h-screen bg-[oklch(0.04_0_0)] p-3">
      <div className="relative mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1500px] items-center justify-center overflow-hidden rounded-[24px] bg-gradient-to-b from-white via-[oklch(0.97_0.04_85)] to-[oklch(0.93_0.1_75)] p-6 shadow-2xl">
        <form onSubmit={submit} className="w-full max-w-sm rounded-3xl border border-black/5 bg-white/80 p-8 backdrop-blur">
          <Link to="/" className="mb-6 flex items-center gap-2.5">
            <div className="grid h-7 w-7 grid-cols-2 gap-0.5">
              <span className="rounded-full bg-[oklch(0.68_0.22_40)]" />
              <span className="rounded-full bg-[oklch(0.68_0.22_40)]" />
              <span className="rounded-full bg-[oklch(0.68_0.22_40)]" />
              <span className="rounded-full bg-[oklch(0.68_0.22_40)]" />
            </div>
            <span className="text-lg font-bold tracking-tight">Beevr</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Reset password</h1>
          <p className="mt-1 text-sm text-[oklch(0.45_0_0)]">
            {ready ? "Choose a new password for your account." : "Open the reset link from your email to continue."}
          </p>
          <input
            type="password"
            required
            minLength={6}
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!ready || busy}
            className="mt-6 w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[oklch(0.68_0.22_40)] disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!ready || busy}
            className="mt-3 w-full rounded-xl bg-[oklch(0.68_0.22_40)] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[oklch(0.68_0.22_40)]/30 hover:bg-[oklch(0.62_0.22_40)] disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save new password"}
          </button>
          <Link to="/auth" className="mt-4 block text-center text-xs font-semibold text-[oklch(0.55_0.2_40)] hover:underline">
            Back to sign in
          </Link>
        </form>
      </div>
    </div>
  );
}