import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Brain, Loader2, Check, FileText, Search, Mail, User, Home, Users, FileStack, Bot, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

type ThinkingStep = {
  id: string;
  label: string;
  icon: typeof Search;
  substeps: { text: string; ms: number }[];
};

const THINKING_STEPS: ThinkingStep[] = [
  {
    id: "doc",
    label: "Reading Beevr documentation in Notion",
    icon: FileStack,
    substeps: [
      { text: "Connecting to Notion workspace…", ms: 600 },
      { text: "Found 4 docs tagged #beevr", ms: 700 },
      { text: "Parsing 'Employment & Hiring Policy.md'", ms: 900 },
      { text: "Extracted 12 clauses · standard Beevr template v3", ms: 600 },
    ],
  },
  {
    id: "find",
    label: "Looking up Adithya in your contacts",
    icon: User,
    substeps: [
      { text: "Searching Gmail contacts for 'Adithya'…", ms: 700 },
      { text: "2 matches found · disambiguating by recent threads", ms: 800 },
      { text: "Resolved → Adithya Rao · adithya@beevr.io", ms: 600 },
    ],
  },
  {
    id: "draft",
    label: "Drafting employment contract from Beevr template",
    icon: FileText,
    substeps: [
      { text: "Filling employee details…", ms: 700 },
      { text: "Applying Beevr compensation grid (L4 · Engineering)", ms: 900 },
      { text: "Inserting equity vesting schedule (4y / 1y cliff)", ms: 800 },
      { text: "Rendering PDF · adithya-rao-employment.pdf (3 pages)", ms: 700 },
    ],
  },
  {
    id: "send",
    label: "Sending contract to adithya@beevr.io",
    icon: Mail,
    substeps: [
      { text: "Uploading to DocuSign…", ms: 700 },
      { text: "Configuring signature fields", ms: 600 },
      { text: "Dispatching from animesh@beevr.io", ms: 700 },
      { text: "Delivered ✓", ms: 400 },
    ],
  },
];

type Message =
  | { id: string; role: "user"; content: string }
  | {
      id: string;
      role: "assistant";
      steps: {
        step: ThinkingStep;
        status: "pending" | "active" | "done";
        subIndex: number;
        elapsed: number;
      }[];
      startedAt: number;
      done: boolean;
    };

function Index() {
  const [input, setInput] = useState("Look at the doc about Beevr and send Adithya an employment contract");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Global tick for live elapsed time
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => setTick((t) => t + 1), 100);
    return () => clearInterval(id);
  }, [isRunning]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, tick]);

  const handleSend = async () => {
    if (!input.trim() || isRunning) return;
    setIsRunning(true);

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: input.trim() };
    const assistantId = crypto.randomUUID();
    const assistantMsg: Message = {
      id: assistantId,
      role: "assistant",
      steps: THINKING_STEPS.map((s) => ({ step: s, status: "pending", subIndex: 0, elapsed: 0 })),
      startedAt: Date.now(),
      done: false,
    };

    setMessages((m) => [...m, userMsg, assistantMsg]);
    setInput("");

    for (let i = 0; i < THINKING_STEPS.length; i++) {
      const step = THINKING_STEPS[i];
      // mark active
      setMessages((m) =>
        m.map((msg) =>
          msg.id === assistantId && msg.role === "assistant"
            ? {
                ...msg,
                steps: msg.steps.map((s, idx) => ({
                  ...s,
                  status: idx < i ? "done" : idx === i ? "active" : "pending",
                  subIndex: idx === i ? 0 : s.subIndex,
                })),
              }
            : msg,
        ),
      );

      // walk through substeps
      for (let j = 0; j < step.substeps.length; j++) {
        await new Promise((r) => setTimeout(r, step.substeps[j].ms));
        setMessages((m) =>
          m.map((msg) =>
            msg.id === assistantId && msg.role === "assistant"
              ? {
                  ...msg,
                  steps: msg.steps.map((s, idx) =>
                    idx === i ? { ...s, subIndex: j + 1 } : s,
                  ),
                }
              : msg,
          ),
        );
      }
    }

    setMessages((m) =>
      m.map((msg) =>
        msg.id === assistantId && msg.role === "assistant"
          ? { ...msg, steps: msg.steps.map((s) => ({ ...s, status: "done" })), done: true }
          : msg,
      ),
    );
    setIsRunning(false);
  };

  const navItems = [
    { label: "Home", icon: Home },
    { label: "Brain", icon: Brain, active: true },
    { label: "Team Spaces", icon: Users },
    { label: "Docs", icon: FileStack },
    { label: "Agents", icon: Bot },
    { label: "Approvals", icon: ShieldCheck },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar p-4 md:block">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Brain className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold">Acme Inc</span>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  item.active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex flex-1 flex-col">
        {/* Browser-like header */}
        <div className="flex items-center gap-2 border-b border-border px-6 py-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[oklch(0.62_0.22_25)]" />
            <span className="h-3 w-3 rounded-full bg-[oklch(0.78_0.16_70)]" />
            <span className="h-3 w-3 rounded-full bg-[oklch(0.72_0.18_145)]" />
          </div>
          <div className="mx-auto rounded-md bg-muted px-4 py-1 text-xs text-muted-foreground">
            app.beevr.io/brain
          </div>
        </div>

        <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-8">
          <h1 className="text-3xl font-bold">Ask your company brain</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Search across all your connected data sources
          </p>

          <div ref={scrollRef} className="mt-8 space-y-6">
            {messages.map((msg) =>
              msg.role === "user" ? (
                <div key={msg.id} className="flex justify-end">
                  <div className="max-w-[80%] rounded-xl bg-primary px-5 py-3 text-base text-primary-foreground">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <AssistantBubble key={msg.id} msg={msg} />
              ),
            )}
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-border bg-background px-6 py-4">
          <div className="mx-auto flex max-w-4xl items-end gap-2 rounded-xl border border-border bg-card p-2 focus-within:border-primary">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={1}
              placeholder="Ask anything about your company…"
              className="max-h-40 flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
              disabled={isRunning}
            />
            <button
              onClick={handleSend}
              disabled={isRunning || !input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function AssistantBubble({ msg }: { msg: Extract<Message, { role: "assistant" }> }) {
  const allDone = msg.steps.every((s) => s.status === "done");

  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Brain className="h-4 w-4" />
      </div>
      <div className="flex-1 rounded-xl border border-border bg-card p-5">
        {/* Thinking section */}
        <div className="mb-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            {!allDone ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                Thinking…
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5 text-primary" />
                Completed
              </>
            )}
          </div>
          <ol className="space-y-1.5">
            {msg.steps.map(({ step, status }) => {
              const Icon = step.icon;
              return (
                <li
                  key={step.id}
                  className={`flex items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors ${
                    status === "active" ? "bg-muted" : ""
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-md ${
                      status === "done"
                        ? "bg-accent text-primary"
                        : status === "active"
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {status === "done" ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : status === "active" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Icon className="h-3.5 w-3.5" />
                    )}
                  </span>
                  <span
                    className={
                      status === "pending"
                        ? "text-muted-foreground"
                        : status === "active"
                        ? "font-medium text-foreground"
                        : "text-foreground"
                    }
                  >
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        {msg.done && (
          <div className="animate-in fade-in slide-in-from-bottom-2 space-y-3 border-t border-border pt-4 text-sm leading-relaxed">
            <p className="text-foreground">
              I read the Beevr company doc, found Adithya's details, and generated an
              employment contract using the standard Beevr template:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  Pulled company terms & policies{" "}
                  <span className="text-muted-foreground">(Notion: Beevr / Handbook)</span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  Resolved recipient: <span className="font-medium">Adithya Rao</span>{" "}
                  <span className="text-muted-foreground">(Gmail contacts)</span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  Generated <span className="font-medium">adithya-rao-employment.pdf</span> and dispatched for signature{" "}
                  <span className="text-muted-foreground">(DocuSign)</span>
                </span>
              </li>
            </ul>
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-primary/30 bg-accent/40 px-3 py-2.5 text-sm text-primary">
              <Mail className="h-4 w-4" />
              Contract sent to adithya@beevr.io using your email address.
            </div>
            <div className="flex gap-2 pt-1">
              <button className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
                <FileText className="h-4 w-4" />
                View Contract
              </button>
              <button className="rounded-md border border-border px-3 py-2 text-sm hover:bg-muted">
                View Sources
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
