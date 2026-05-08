import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Bot, FileText, Search, MessageSquare, Mail, GitBranch, Calendar, DollarSign, Zap } from "lucide-react";

export const Route = createFileRoute("/app/")({
  component: AppHome,
});

type Suggestion = { icon: typeof Bot; label: string; tag: "Build agent" | "Brain"; source: string };

// Pool of "live" activity → questions you might want to ask about it
const ACTIVITY_SUGGESTIONS: Suggestion[] = [
  { icon: MessageSquare, source: "Slack", label: "summarize what happened in #engineering today", tag: "Brain" },
  { icon: GitBranch, source: "GitHub", label: "what's in PR #482 that Sarah just merged?", tag: "Brain" },
  { icon: Mail, source: "Gmail", label: "draft a reply to Maya's onboarding email", tag: "Brain" },
  { icon: FileText, source: "Notion", label: "review the Q4 Hiring Plan Adithya just created", tag: "Brain" },
  { icon: DollarSign, source: "Stripe", label: "agent that pings me when invoices over $1k are paid", tag: "Build agent" },
  { icon: Calendar, source: "Calendar", label: "prep notes for the Design review starting soon", tag: "Brain" },
  { icon: Zap, source: "Linear", label: "what's blocking BEE-218?", tag: "Brain" },
  { icon: Bot, source: "Agent", label: "agent that triages new Gmail into Linear tickets", tag: "Build agent" },
  { icon: FileText, source: "Drive", label: "summarize 'Investor Update Nov.pdf'", tag: "Brain" },
  { icon: MessageSquare, source: "Slack", label: "agent that posts a daily standup digest to #engineering", tag: "Build agent" },
];

function AppHome() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  // Rotating "based on live activity" suggestions
  const [suggestions, setSuggestions] = useState<Suggestion[]>(() =>
    [...ACTIVITY_SUGGESTIONS].sort(() => Math.random() - 0.5).slice(0, 4),
  );
  useEffect(() => {
    const id = setInterval(() => {
      setSuggestions(([...ACTIVITY_SUGGESTIONS].sort(() => Math.random() - 0.5)).slice(0, 4));
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const submit = (text: string) => {
    const t = text.trim();
    if (!t) return;
    if (/^agent\b/i.test(t)) {
      const prompt = t.replace(/^agent[:\s]*/i, "");
      navigate({ to: "/app/agents/new", search: { prompt } });
    } else {
      navigate({ to: "/app/brain", search: { q: t } });
    }
  };

  return (
    <div className="relative flex h-full flex-col">
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto pb-40">
        <div className="mx-auto w-full max-w-3xl px-6 pt-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-white/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <Sparkles className="h-3 w-3 text-primary" /> Good evening, Adithya
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight">What can I do for you?</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Ask the brain — or start with <span className="rounded bg-accent px-1.5 py-0.5 font-mono text-xs text-accent-foreground">agent</span> to build a new one.
            </p>
          </div>

          <div className="mt-10">
            <div className="mb-3 flex items-center gap-2 px-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[oklch(0.68_0.22_40)] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[oklch(0.68_0.22_40)]" />
              </span>
              Based on live activity
            </div>
            <div className="space-y-1.5">
              {suggestions.map((s) => (
                <button
                  key={s.label}
                  onClick={() => submit(s.tag === "Build agent" ? `agent ${s.label.replace(/^agent\s+/i, "")}` : s.label)}
                  className="group flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:border-black/[0.06] hover:bg-white/60 hover:text-foreground"
                >
                  <s.icon className="h-4 w-4 text-primary/70" />
                  <span className="rounded-md bg-black/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-foreground/70">{s.source}</span>
                  <span className="flex-1 truncate">{s.label}</span>
                  <span className="rounded-full bg-accent/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    {s.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed bottom input */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/90 to-transparent pb-6 pt-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(q);
          }}
          className="pointer-events-auto mx-auto w-full max-w-3xl px-6"
        >
          <div className="flex items-center gap-2 rounded-2xl border border-black/[0.08] bg-white/90 p-2 shadow-lg backdrop-blur transition-colors focus-within:border-primary/50 focus-within:shadow-xl">
            <Search className="ml-3 h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              autoFocus
              placeholder="Ask anything, or type 'agent ...' to build one"
              className="flex-1 bg-transparent px-1 py-2 text-base outline-none placeholder:text-muted-foreground/70"
            />
            <button
              type="submit"
              className="flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-40"
              disabled={!q.trim()}
            >
              Go <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
