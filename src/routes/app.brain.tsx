import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  Send,
  Brain,
  Loader2,
  Check,
  ChevronDown,
  FileText,
  Search,
  Mail,
  User,
  FileStack,
  AlertCircle,
  Sparkles,
  Inbox,
  BookOpen,
} from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

export const Route = createFileRoute("/app/brain")({
  validateSearch: z.object({ q: z.string().optional() }),
  component: BrainPage,
});

const TOOL_META: Record<
  string,
  { label: string; icon: typeof Search; verb: string }
> = {
  think: { label: "Thinking", icon: Sparkles, verb: "Thinking" },
  searchNotion: { label: "Notion", icon: FileStack, verb: "Searching Notion" },
  searchContacts: { label: "Contacts", icon: User, verb: "Looking up contact" },
  searchEmails: { label: "Gmail", icon: Inbox, verb: "Searching inbox" },
  summarizeDoc: { label: "Summarize", icon: BookOpen, verb: "Reading document" },
  draftDocument: { label: "Draft", icon: FileText, verb: "Drafting document" },
  sendEmail: { label: "Email", icon: Mail, verb: "Sending email" },
};

function BrainPage() {
  const { q } = Route.useSearch();
  const [input, setInput] = useState("");
  const transport = useRef(new DefaultChatTransport({ api: "/api/chat" })).current;
  const { messages, sendMessage, status, error } = useChat({
    transport,
    onError: (e) => toast.error(e.message || "Chat error"),
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sentInitial = useRef(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (q && !sentInitial.current) {
      sentInitial.current = true;
      sendMessage({ text: q });
    }
  }, [q, sendMessage]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, status]);

  const isLoading = status === "submitted" || status === "streaming";

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input.trim() });
    setInput("");
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="relative flex h-[calc(100vh-3rem)] min-h-0 flex-1 flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth">
        <div className={`mx-auto w-full max-w-3xl px-6 ${isEmpty ? "flex min-h-full flex-col justify-center pb-32 pt-8" : "pb-40 pt-10"}`}>
          {isEmpty && (
            <div className="animate-[fadeInUp_300ms_ease-out]">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.75_0.15_75)] text-primary-foreground shadow-lg shadow-primary/20">
                <Brain className="h-7 w-7" />
              </div>
              <h1 className="text-4xl font-semibold tracking-tight">Ask your company brain</h1>
              <p className="mt-2 text-base text-muted-foreground">
                Connected to Notion, Gmail contacts, document drafting, and email.
              </p>
              <div className="mt-8 grid gap-2 text-sm sm:grid-cols-2">
                {[
                  "Look at the doc about Beevr and send Adithya an employment contract",
                  "Find the Q3 roadmap in Notion and summarize it",
                  "Draft a follow-up email to the latest customer thread",
                  "Who emailed me about pricing this week?",
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage({ text: s })}
                    className="clicky group rounded-xl border border-black/5 bg-white/70 px-4 py-3 text-left leading-snug text-foreground/80 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white hover:text-foreground hover:shadow-md"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            {messages.map((msg) =>
              msg.role === "user" ? (
                <div key={msg.id} className="flex justify-end">
                  <div className="animate-pop max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-[15px] leading-relaxed text-primary-foreground shadow-sm">
                    {msg.parts
                      .map((p) => (p.type === "text" ? p.text : ""))
                      .join("")}
                  </div>
                </div>
              ) : (
                <AssistantMessage key={msg.id} msg={msg} />
              ),
            )}
            {status === "submitted" && (
              <div className="animate-pop flex gap-3">
                <div className="ring-pulse flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Brain className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm">
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
                  </span>
                  <span className="shimmer-text">Thinking…</span>
                </div>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error.message}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
        <div className="h-16 bg-gradient-to-t from-white/90 via-white/60 to-transparent" />
        <div className="pointer-events-auto bg-white/80 px-6 pb-5 pt-2 backdrop-blur-xl">
          <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-black/10 bg-white p-2 shadow-lg shadow-black/5 transition-all focus-within:border-primary/50 focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_15%,transparent)]">
            <textarea
              ref={inputRef}
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
              className="max-h-40 flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] outline-none placeholder:text-muted-foreground"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="clicky clicky-sm flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-all hover:shadow-md disabled:opacity-40"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-muted-foreground/70">
            Press Enter to send · Shift + Enter for new line
          </p>
        </div>
      </div>

    </div>
  );
}

type UIMsg = ReturnType<typeof useChat>["messages"][number];

function AssistantMessage({ msg }: { msg: UIMsg }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[oklch(0.75_0.15_75)] text-primary-foreground shadow-sm">
        <Brain className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1 space-y-2 rounded-2xl rounded-tl-md border border-black/5 bg-white/80 p-4 shadow-sm backdrop-blur">
        {msg.parts.map((part, idx) => {
          if (part.type === "text") {
            return (
              <div
                key={idx}
                className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground"
              >
                {part.text}
              </div>
            );
          }
          if (part.type.startsWith("tool-")) {
            return <ToolPart key={idx} part={part as ToolPartShape} />;
          }
          return null;
        })}
      </div>
    </div>
  );
}

type ToolPartShape = {
  type: string;
  toolCallId?: string;
  state: "input-streaming" | "input-available" | "output-available" | "output-error";
  input?: unknown;
  output?: unknown;
  errorText?: string;
};

function ToolPart({ part }: { part: ToolPartShape }) {
  const [open, setOpen] = useState(false);
  const toolName = part.type.replace(/^tool-/, "");
  const meta = TOOL_META[toolName] ?? {
    label: toolName,
    icon: Search,
    verb: toolName,
  };
  const Icon = meta.icon;
  const isRunning =
    part.state === "input-streaming" || part.state === "input-available";
  const isError = part.state === "output-error";
  const isDone = part.state === "output-available";

  // Special inline rendering for "think" reasoning steps
  if (toolName === "think") {
    const thought =
      (part.input as { thought?: string } | undefined)?.thought ?? "";
    return (
      <div className="animate-pop flex items-start gap-2 text-sm text-muted-foreground">
        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          {isRunning ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Sparkles className="h-3 w-3" />
          )}
        </span>
        <span className={`italic leading-relaxed ${isRunning ? "shimmer-text" : ""}`}>
          {thought || (isRunning ? "Thinking…" : "")}
        </span>
      </div>
    );
  }

  return (
    <div className={`animate-pop overflow-hidden rounded-lg border bg-muted/40 transition-colors ${isRunning ? "border-primary/40" : "border-border"}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="clicky-sm flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-muted/70 active:bg-muted"
      >
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-md ${
            isDone
              ? "bg-accent text-primary"
              : isError
                ? "bg-destructive/10 text-destructive"
                : "bg-primary/15 text-primary"
          }`}
        >
          {isRunning ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : isError ? (
            <AlertCircle className="h-3.5 w-3.5" />
          ) : isDone ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Icon className="h-3.5 w-3.5" />
          )}
        </span>
        <span className="flex-1 truncate">
          <span className="font-medium text-foreground">{meta.label}</span>
          <span className="ml-2 text-muted-foreground">
            {isRunning
              ? `${meta.verb}…`
              : isError
                ? "Failed"
                : summarizeInput(toolName, part.input)}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="space-y-2 border-t border-border px-3 py-2 text-xs">
          {part.input !== undefined && (
            <div>
              <div className="mb-1 font-medium text-muted-foreground">Input</div>
              <pre className="overflow-x-auto rounded bg-background p-2 text-foreground">
                {JSON.stringify(part.input, null, 2)}
              </pre>
            </div>
          )}
          {part.output !== undefined && (
            <div>
              <div className="mb-1 font-medium text-muted-foreground">Output</div>
              <pre className="overflow-x-auto rounded bg-background p-2 text-foreground">
                {JSON.stringify(part.output, null, 2)}
              </pre>
            </div>
          )}
          {part.errorText && (
            <div className="text-destructive">{part.errorText}</div>
          )}
        </div>
      )}
    </div>
  );
}

function summarizeInput(name: string, input: unknown): string {
  if (!input || typeof input !== "object") return "";
  const i = input as Record<string, unknown>;
  if (name === "searchNotion") return `"${i.query}"`;
  if (name === "searchEmails") return `"${i.query}"`;
  if (name === "searchContacts") return `"${i.name}"`;
  if (name === "summarizeDoc") return `${i.url}`;
  if (name === "draftDocument") return `${i.title}`;
  if (name === "sendEmail") return `→ ${i.to}`;
  return "";
}
