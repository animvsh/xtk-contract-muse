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
  searchNotion: { label: "Notion", icon: FileStack, verb: "Searching Notion" },
  searchContacts: { label: "Contacts", icon: User, verb: "Looking up contact" },
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

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-4xl px-6 py-8">
          {messages.length === 0 && (
            <>
              <h1 className="text-3xl font-bold">Ask your company brain</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Connected to Notion, Gmail contacts, document drafting, and email.
              </p>
              <div className="mt-6 grid gap-2 text-sm">
                {[
                  "Look at the doc about Beevr and send Adithya an employment contract",
                  "Find the Q3 roadmap in Notion and summarize it",
                  "Draft a follow-up email to the latest customer thread",
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage({ text: s })}
                    className="clicky rounded-lg border border-border bg-card px-3 py-2 text-left hover:border-primary/40 hover:bg-accent hover:shadow-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="mt-8 space-y-6">
            {messages.map((msg) =>
              msg.role === "user" ? (
                <div key={msg.id} className="flex justify-end">
                  <div className="animate-pop max-w-[80%] rounded-xl bg-primary px-5 py-3 text-base text-primary-foreground shadow-sm">
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

      <div className="shrink-0 border-t border-black/5 bg-white/70 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-end gap-2 rounded-xl border border-black/10 bg-white p-2 shadow-sm transition-all focus-within:border-primary focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_15%,transparent)]">
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
            className="max-h-40 flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="clicky clicky-sm flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm hover:shadow-md disabled:opacity-40"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

    </div>
  );
}

type UIMsg = ReturnType<typeof useChat>["messages"][number];

function AssistantMessage({ msg }: { msg: UIMsg }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Brain className="h-4 w-4" />
      </div>
      <div className="flex-1 space-y-2 rounded-xl border border-border bg-card p-5">
        {msg.parts.map((part, idx) => {
          if (part.type === "text") {
            return (
              <div
                key={idx}
                className="whitespace-pre-wrap text-sm leading-relaxed text-foreground"
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

  return (
    <div className="rounded-lg border border-border bg-muted/40">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-muted/60"
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
        <span className="flex-1">
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
  if (name === "searchContacts") return `"${i.name}"`;
  if (name === "draftDocument") return `${i.title}`;
  if (name === "sendEmail") return `→ ${i.to}`;
  return "";
}
