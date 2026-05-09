import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

type ChatRequestBody = { messages?: unknown };

const tools = {
  createPlan: tool({
    description:
      "FIRST tool call of every response. Lay out a plan as 3-5 high-level parent tasks, each with 1-3 short sub-tasks. Use kebab-case unique IDs. After this, call updateStep to move tasks through 'in-progress' → 'done' (or 'warning') as you actually work.",
    inputSchema: z.object({
      tasks: z.array(z.object({
        id: z.string().describe("Unique kebab-case id, e.g. 'research-docs'"),
        title: z.string().describe("Short parent task title (3-6 words)"),
        subtasks: z.array(z.object({
          id: z.string(),
          title: z.string().describe("Short sub-task title (3-6 words)"),
        })).min(1).max(4),
      })).min(3).max(6),
    }),
    execute: async ({ tasks }) => {
      await new Promise((r) => setTimeout(r, 400));
      return { ok: true, count: tasks.length };
    },
  }),
  updateStep: tool({
    description:
      "Update the status of one plan task or sub-task. Call this BEFORE starting work on a step (status: 'in-progress'), and AFTER finishing it (status: 'done' or 'warning'). One step at a time.",
    inputSchema: z.object({
      id: z.string().describe("The task or sub-task id from the plan"),
      status: z.enum(["pending", "in-progress", "done", "warning"]),
      note: z.string().optional().describe("Optional one-sentence note about what happened"),
    }),
    execute: async ({ id, status, note }) => {
      await new Promise((r) => setTimeout(r, 350));
      return { ok: true, id, status, note };
    },
  }),
  searchNotion: tool({
    description: "Search the user's Notion workspace for documents, notes, or pages.",
    inputSchema: z.object({ query: z.string().describe("Search keywords") }),
    execute: async ({ query }) => {
      await new Promise((r) => setTimeout(r, 700));
      const all = [
        { title: "Beevr Handbook · Employment & Hiring Policy", snippet: "Standard Beevr template v3 — comp grid, equity (4y/1y cliff), PTO, IP assignment.", url: "notion://beevr/handbook/employment" },
        { title: "Q3 2026 Roadmap", snippet: "Pillars: Cloud Builds GA, Approvals v2, MCP keys, /docs polish. Ship by Sep 30.", url: "notion://beevr/roadmap/q3" },
        { title: "Beevr Engineering Levels", snippet: "L1–L7 ladder with comp bands and expectations.", url: "notion://beevr/eng/levels" },
        { title: "About Beevr", snippet: "Beevr is a chat-native company brain that builds and hosts agents safely.", url: "notion://beevr/about" },
        { title: "Pricing FAQ — Internal", snippet: "Tiers: Starter $0, Team $25/seat, Business $99/seat. Enterprise on request.", url: "notion://beevr/pricing-faq" },
        { title: "Customer Onboarding Playbook", snippet: "Day 0 welcome, Day 3 check-in, Day 14 health review.", url: "notion://beevr/onboarding" },
      ];
      const q = query.toLowerCase();
      const results = all.filter((r) =>
        r.title.toLowerCase().includes(q) ||
        r.snippet.toLowerCase().includes(q) ||
        q.split(/\s+/).some((w) => w.length > 2 && (r.title + r.snippet).toLowerCase().includes(w)),
      );
      return { results: results.length ? results.slice(0, 4) : all.slice(0, 3) };
    },
  }),
  searchContacts: tool({
    description: "Look up a person in Gmail / Google Contacts by name.",
    inputSchema: z.object({ name: z.string() }),
    execute: async ({ name }) => {
      await new Promise((r) => setTimeout(r, 600));
      const slug = name.toLowerCase().replace(/[^a-z]/g, "");
      return { matches: [{ name, email: `${slug}@beevr.io`, title: "Engineering", recentThreads: 3, lastSeen: "2 days ago" }] };
    },
  }),
  searchEmails: tool({
    description: "Search the user's Gmail inbox for recent threads matching a query.",
    inputSchema: z.object({ query: z.string(), days: z.number().optional() }),
    execute: async ({ query, days = 7 }) => {
      await new Promise((r) => setTimeout(r, 750));
      const threads = [
        { from: "maya@northwind.co", subject: "Re: Pricing for 50 seats", preview: "Thanks — can we get the Business tier at $79/seat for an annual deal?", receivedAt: "2d ago" },
        { from: "jordan@acme.dev", subject: "Pricing question", preview: "Quick one: does Team tier include SSO?", receivedAt: "4d ago" },
        { from: "ari@helix.ai", subject: "Following up on demo", preview: "Loved the agent builder. What's the smallest plan with approvals?", receivedAt: "5d ago" },
      ];
      return { threads, window: `last ${days} days`, query };
    },
  }),
  summarizeDoc: tool({
    description: "Summarize a Notion document by URL into bullet points.",
    inputSchema: z.object({ url: z.string(), focus: z.string().optional() }),
    execute: async ({ url }) => {
      await new Promise((r) => setTimeout(r, 800));
      return {
        url,
        bullets: [
          "Cloud Builds reaches GA with hosted runtime + logs",
          "Approvals v2 adds per-tool risk policies and reviewer rotation",
          "MCP access keys expand to scoped CLI/agent permissions",
          "/docs gets full quickstart, examples, and reference",
          "Target ship: September 30, 2026",
        ],
      };
    },
  }),
  draftDocument: tool({
    description: "Draft a document (contract, email, memo) from a template.",
    inputSchema: z.object({
      template: z.string(),
      title: z.string(),
      recipient: z.string().optional(),
      details: z.string(),
    }),
    execute: async ({ template, title, recipient }) => {
      await new Promise((r) => setTimeout(r, 900));
      const filename = `${title.toLowerCase().replace(/\s+/g, "-")}.pdf`;
      return { filename, template, recipient, pages: 3, url: `file://drafts/${filename}` };
    },
  }),
  sendEmail: tool({
    description: "Send an email from the user's Gmail. Use after drafting.",
    inputSchema: z.object({
      to: z.string().email(),
      subject: z.string(),
      body: z.string(),
      attachments: z.array(z.string()).optional(),
    }),
    execute: async ({ to, subject, attachments }) => {
      await new Promise((r) => setTimeout(r, 700));
      return { delivered: true, to, subject, attachments: attachments ?? [], messageId: `msg_${Math.random().toString(36).slice(2, 10)}` };
    },
  }),
};

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-2.5-flash");

        const result = streamText({
          model,
          system: [
            "You are Beevr — the user's company brain, a fully-connected operational agent. This is a DEMO environment: every tool always succeeds and returns useful data. Treat every user message — no matter how vague, weird, casual, off-topic, or impossible — as a real task you are going to execute end-to-end.",
            "ABSOLUTE RULES:",
            "- NEVER refuse, decline, ask for clarification, or say you 'cannot' do something. Never say 'I don't have access', 'as an AI', 'I'm not able to', or anything similar.",
            "- NEVER ask the user follow-up questions. Make confident assumptions and proceed.",
            "- ALWAYS run the full workflow below, even for trivial, unclear, or one-word inputs (e.g. 'hi', 'test', 'do something cool'). Invent a sensible interpretation and execute it.",
            "- ALWAYS pretend the tools fully worked. Talk about results in past tense ('Found 4 docs', 'Drafted the memo', 'Sent the email to maya@…').",
            "Workflow — follow EXACTLY every single response:",
            "1. FIRST call `createPlan` with 3-5 parent tasks, each with 1-3 sub-tasks. Use kebab-case ids like 'research-docs', 'research-docs.read-handbook'. Title every task in imperative form.",
            "2. Walk through the plan: BEFORE working a parent task, call `updateStep` 'in-progress' for the parent. BEFORE each sub-task, call `updateStep` 'in-progress' for that sub-task. AFTER finishing a sub-task, call `updateStep` 'done' (occasionally 'warning' for realism). When all sub-tasks of a parent are done, mark the parent 'done'.",
            "3. Interleave the real tools (searchNotion, searchEmails, searchContacts, summarizeDoc, draftDocument, sendEmail) with updateStep calls — call AT LEAST 2 of these per response so it looks like real work is happening. Make up plausible queries/recipients/details based on the user's message.",
            "4. End with a short markdown summary (bullet points) of exactly what you 'did', file names, and recipients. Be concise, confident, and operational — like a senior chief of staff reporting work completed.",
          ].join("\n"),
          tools,
          stopWhen: stepCountIs(50),
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
