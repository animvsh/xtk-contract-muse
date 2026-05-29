# Plan: Cleaner UI + Real AI Agent Builder

## 1. Home page — search-first

Rebuild `/app` (`src/routes/app.index.tsx`) as a single centered command bar:

- Big greeting "Good evening, Adithya" + a single rounded input: _"Ask the brain, or type 'agent ...' to build one"_
- Smart routing on submit:
  - input starts with `agent` → navigate to `/app/agents/new?prompt=...`
  - otherwise → `/app/brain?q=...`
- Below input: 3 quick-suggest chips (Summarize standup, Draft contract, Build agent)
- Right rail keeps `LiveFeed` (already there) but restyled lighter — softer cards, no harsh borders, tighter type scale
- Remove the cluttered "cards grid + recent activity" block

## 2. AI agent builder (real backend)

Enable Lovable Cloud, then add a server function `createAgent` that calls Lovable AI Gateway (`google/gemini-3-flash-preview`) with structured tool-calling output:

```ts
// src/lib/agents.functions.ts
createServerFn POST → { prompt }
  → AI returns { name, description, trigger, steps[], integrations[] }
  → store in `agents` table (id, user_id, name, spec jsonb, status, created_at)
```

Tables (Cloud):

- `agents` — id, name, spec jsonb, status, runs, created_at
- `agent_runs` — id, agent_id, output text, created_at
- RLS: owner-only via `auth.uid()`

New routes:

- `/app/agents/new` — prompt box ("Describe your agent…"), shows streaming AI plan, then "Create"
- `/app/agents/$id` — detail with **n8n-style canvas** (see §3) + Run button
  - "Run" calls server fn `runAgent` → AI generates a fake but plausible execution log → inserted into `agent_runs` → streamed back

`/app/agents` list becomes real (queries table, replaces hardcoded array).

## 3. n8n-style visual builder

On `/app/agents/$id`:

- Horizontal node graph rendered with pure SVG + divs (no new dependency)
- Nodes derived from `spec.steps[]`: Trigger → Step → Step → Output
- Each node: icon + title + integration chip; connector lines with arrows
- Click a node → side panel with editable JSON of that step
- "Run" pulses each node in sequence as the run progresses (fake but tied to streamed log lines)

## 4. Team Spaces — invite people

Rebuild `/app/team`:

- Cleaner card grid (less gradient noise, more whitespace)
- Click space → `/app/team/$id` with Members list + "Invite" dialog
- `space_members` table (space_id, email, role) — Cloud-backed, real insert
- Invite is mock-send (toast "Invite sent to …") but row persists

## 5. MCP page (new)

New `/app/mcp`:

- Header: "Model Context Protocol — let people plug in their own data"
- Grid of MCP server cards (Notion, Linear, Granola, Sentry, Sanity, Custom URL)
- "Add custom MCP" dialog → `mcp_servers` table (name, url, auth_token)
- Add to sidebar nav (between Connections and Approvals)

## 6. Connections — cleaner

Refresh `/app/connections`:

- Replace colored letter tiles with consistent monochrome icon tiles + subtle brand accent dot
- Group: **Connected** (top) and **Available** (below)
- Persist toggles in `connections` table instead of local state

## 7. Global UI polish

- Tighten spacing scale, reduce border opacity (`black/5` → `black/[0.04]`)
- Replace heavy cream gradient on main canvas with a single near-white surface; keep ambient orange glow only in app shell
- Unify card style: `rounded-2xl border border-black/[0.05] bg-white/70 backdrop-blur`
- Standard page header component (title + subtle subtitle + optional action)
- Softer primary button: `rounded-xl` with subtle inner highlight

## Technical details

- Backend: enable Lovable Cloud (Supabase) for tables + auth-scoped RLS
- AI: Lovable AI Gateway via `createServerFn` (server-only `LOVABLE_API_KEY`); structured output via tool-calling for agent specs; streaming for run logs
- New files:
  - `src/lib/agents.functions.ts`, `src/lib/mcp.functions.ts`, `src/lib/team.functions.ts`
  - `src/routes/app.agents.new.tsx`, `src/routes/app.agents.$id.tsx`
  - `src/routes/app.team.$id.tsx`, `src/routes/app.mcp.tsx`
  - `src/components/agent-canvas.tsx`, `src/components/page-header.tsx`
- Migrations: `agents`, `agent_runs`, `space_members`, `mcp_servers`, `connections` with RLS policies (owner-only)
- Updated: `app.index.tsx`, `app.tsx` (sidebar adds MCP), `app.team.tsx`, `app.connections.tsx`, `app.agents.tsx`, `live-feed.tsx`

## Out of scope

- Real OAuth to Notion/Slack/etc. (still mock toggles)
- Real email sending for invites
- Drag-to-rearrange nodes in the canvas (read-only graph for v1)

Ready to build — confirm and I'll enable Cloud and ship it.
