import { createMemoryClient } from "@xtraceai/memory";

export const xtrace = createMemoryClient({
  apiKey: import.meta.env.XTRACE_API_KEY,
});

export async function ingestMemory(content: string, metadata?: Record<string, string>) {
  return xtrace.ingest({ content, metadata });
}

export async function searchMemory(query: string, limit = 5) {
  return xtrace.search({ query, limit });
}