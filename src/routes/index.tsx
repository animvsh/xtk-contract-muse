import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Loader2, Check, FileText, Search, Mail, User } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

type ThinkingStep = {
  id: string;
  label: string;
  icon: typeof Search;
  duration: number;
};

const THINKING_STEPS: ThinkingStep[] = [
  { id: "scan", label: "Scanning your profile data", icon: Search, duration: 1200 },
  { id: "extract", label: "Extracting employment details", icon: User, duration: 1100 },
  { id: "draft", label: "Drafting employment contract", icon: FileText, duration: 1500 },
  { id: "send", label: "Sending contract via email", icon: Mail, duration: 1300 },
];

type Message =
  | { id: string; role: "user"; content: string }
  | {
      id: string;
      role: "assistant";
      steps: { step: ThinkingStep; status: "pending" | "active" | "done" }[];
      finalContent: string | null;
    };

function Index() {
  const [input, setInput] = useState(
    "Look through my data and send an employment contract based on my information.",
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isRunning) return;
    setIsRunning(true);

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: input.trim() };
    const assistantId = crypto.randomUUID();
    const assistantMsg: Message = {
      id: assistantId,
      role: "assistant",
      steps: THINKING_STEPS.map((s) => ({ step: s, status: "pending" })),
      finalContent: null,
    };

    setMessages((m) => [...m, userMsg, assistantMsg]);
    setInput("");

    for (let i = 0; i < THINKING_STEPS.length; i++) {
      setMessages((m) =>
        m.map((msg) =>
          msg.id === assistantId && msg.role === "assistant"
            ? {
                ...msg,
                steps: msg.steps.map((s, idx) => ({
                  ...s,
                  status: idx < i ? "done" : idx === i ? "active" : "pending",
                })),
              }
            : msg,
        ),
      );
      await new Promise((r) => setTimeout(r, THINKING_STEPS[i].duration));
    }

    setMessages((m) =>
      m.map((msg) =>
        msg.id === assistantId && msg.role === "assistant"
          ? {
              ...msg,
              steps: msg.steps.map((s) => ({ ...s, status: "done" })),
              finalContent:
                "Done — I've drafted the employment contract using the details from your profile (name, role, start date, compensation and equity). The contract has been sent to **alex@yourcompany.com** for signature. You'll get a confirmation once it's viewed.",
            }
          : msg,
      ),
    );

    setIsRunning(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border/60 bg-card/40 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold leading-tight">Contract Assistant</h1>
            <p className="text-xs text-muted-foreground">Demo · Front-end preview</p>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-8">
          {messages.length === 0 && (
            <div className="mt-16 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold">How can I help today?</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Try: "Send an employment contract based on my information."
              </p>
            </div>
          )}

          <div className="space-y-6">
            {messages.map((msg) =>
              msg.role === "user" ? (
                <div key={msg.id} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <AssistantBubble key={msg.id} msg={msg} />
              ),
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-border/60 bg-card/40 backdrop-blur">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <div className="flex items-end gap-2 rounded-2xl border border-border bg-background p-2 shadow-sm focus-within:border-ring">
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
              placeholder="Send a message…"
              className="max-h-40 flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
              disabled={isRunning}
            />
            <button
              onClick={handleSend}
              disabled={isRunning || !input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            This is a non-functional demo. No data is read or sent.
          </p>
        </div>
      </div>
    </div>
  );
}

function AssistantBubble({
  msg,
}: {
  msg: Extract<Message, { role: "assistant" }>;
}) {
  const allDone = msg.steps.every((s) => s.status === "done");
  const hasFinal = !!msg.finalContent;

  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="flex-1 space-y-3">
        <div className="rounded-2xl rounded-tl-sm border border-border bg-card p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            {!allDone ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Thinking…
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                Completed in {(THINKING_STEPS.reduce((a, b) => a + b.duration, 0) / 1000).toFixed(1)}s
              </>
            )}
          </div>
          <ol className="space-y-2">
            {msg.steps.map(({ step, status }) => {
              const Icon = step.icon;
              return (
                <li
                  key={step.id}
                  className={`flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors ${
                    status === "active" ? "bg-muted" : ""
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-md ${
                      status === "done"
                        ? "bg-emerald-500/15 text-emerald-600"
                        : status === "active"
                        ? "bg-primary/15 text-primary"
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

        {hasFinal && (
          <div className="animate-in fade-in slide-in-from-bottom-2 rounded-2xl rounded-tl-sm border border-border bg-card p-4 text-sm leading-relaxed">
            <RichText text={msg.finalContent!} />
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-400">
              <Mail className="h-3.5 w-3.5" />
              Contract sent · employment-contract.pdf
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i} className="font-semibold">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </p>
  );
}
