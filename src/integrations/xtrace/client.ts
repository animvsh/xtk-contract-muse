import { MemoryClient } from "@xtraceai/memory";

export const xtrace = new MemoryClient({
  apiKey: import.meta.env.XTRACE_API_KEY || "",
  orgId: import.meta.env.XTRACE_ORG_ID || "default",
});

export async function ingestMemory(messages: Array<{ role: string; content: string }>, userId?: string, convId?: string) {
  return xtrace.memories.ingest({ messages, user_id: userId, conv_id: convId });
}

export async function searchMemory(query: string, filters?: Record<string, string>, limit = 5) {
  return xtrace.memories.search({ query, filters, limit });
}

export async function pollJobUntilDone(jobId: string) {
  return xtrace.memories.jobs.pollUntilDone(jobId);
}