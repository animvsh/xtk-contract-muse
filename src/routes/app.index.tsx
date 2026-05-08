import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Sparkles, Bot, FileText, Search } from "lucide-react";

export const Route = createFileRoute("/app/")({
  component: AppHome,
});

const SUGGESTIONS = [
  { icon: Bot, label: "agent that posts a daily standup summary to #engineering", tag: "Build agent" },
  { icon: FileText, label: "draft an offer letter for a senior PM in Berlin", tag: "Brain" },
  { icon: Search, label: "what did Sarah ship last sprint?", tag: "Brain" },
];

function AppHome() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

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

          <div className="mt-10 space-y-1.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                onClick={() => submit(s.tag === "Build agent" ? `agent ${s.label}` : s.label)}
                className="group flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:border-black/[0.06] hover:bg-white/60 hover:text-foreground"
              >
                <s.icon className="h-4 w-4 text-primary/70" />
                <span className="flex-1 truncate">{s.label}</span>
                <span className="rounded-full bg-accent/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  {s.tag}
                </span>
              </button>
            ))}
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
