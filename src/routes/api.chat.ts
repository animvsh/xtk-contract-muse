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
  searchNotion: tool({
    description:
      "Search the user's Notion workspace for documents, notes, or pages. Returns matching documents with titles and short snippets.",
    inputSchema: z.object({
      query: z.string().describe("Search keywords"),
    }),
    execute: async ({ query }) => {
      await new Promise((r) => setTimeout(r, 700));
      return {
        results: [
          {
            title: "Beevr Handbook · Employment & Hiring Policy",
            snippet:
              "Standard Beevr template v3 — covers compensation grid, equity vesting (4y/1y cliff), PTO, IP assignment.",
            url: "notion://beevr/handbook/employment",
          },
          {
            title: "Beevr Engineering Levels",
            snippet: "L1–L7 ladder with comp bands and expectations.",
            url: "notion://beevr/eng/levels",
          },
        ].filter((r) => r.title.toLowerCase().includes(query.toLowerCase().split(" ")[0]) || true),
      };
    },
  }),
  searchContacts: tool({
    description:
      "Look up a person in the user's Gmail / Google Contacts by name. Returns email and recent context.",
    inputSchema: z.object({
      name: z.string().describe("Person's name to search for"),
    }),
    execute: async ({ name }) => {
      await new Promise((r) => setTimeout(r, 600));
      const slug = name.toLowerCase().replace(/\s+/g, "");
      return {
        matches: [
          {
            name,
            email: `${slug}@beevr.io`,
            recentThreads: 3,
            lastSeen: "2 days ago",
          },
        ],
      };
    },
  }),
  draftDocument: tool({
    description:
      "Draft a document (contract, email, memo) from a template using provided context. Returns a file handle.",
    inputSchema: z.object({
      template: z.string().describe("Template name, e.g. 'employment-contract'"),
      title: z.string(),
      recipient: z.string().optional(),
      details: z.string().describe("Key fields and context to fill in"),
    }),
    execute: async ({ template, title, recipient }) => {
      await new Promise((r) => setTimeout(r, 900));
      const filename = `${title.toLowerCase().replace(/\s+/g, "-")}.pdf`;
      return {
        filename,
        template,
        recipient,
        pages: 3,
        url: `file://drafts/${filename}`,
      };
    },
  }),
  sendEmail: tool({
    description: "Send an email from the user's Gmail. Use after drafting documents.",
    inputSchema: z.object({
      to: z.string().email(),
      subject: z.string(),
      body: z.string(),
      attachments: z.array(z.string()).optional(),
    }),
    execute: async ({ to, subject, attachments }) => {
      await new Promise((r) => setTimeout(r, 700));
      return {
        delivered: true,
        to,
        subject,
        attachments: attachments ?? [],
        messageId: `msg_${Math.random().toString(36).slice(2, 10)}`,
      };
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
          system:
            "You are the user's company brain — an AI agent with access to Notion docs, Gmail contacts, document drafting, and email sending. " +
            "When the user asks you to do something operational (find a doc, draft a contract, email someone), USE THE PROVIDED TOOLS step by step. " +
            "Always: (1) gather context with search tools, (2) draft with draftDocument, (3) confirm and send with sendEmail when appropriate. " +
            "Be concise. After tool calls complete, write a short summary of what you did with bullet points.",
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
