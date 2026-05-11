import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Play, Loader2, Copy, Check, Server, Code2, BookOpen, History, Settings, Trash2, BarChart3, KeyRound, Plus, Users as UsersIcon, Activity, Clock, Lock, AlertCircle, Power } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/app/apis/$id")({
  component: ApiPlaygroundPage,
});

type ApiParam = {
  name: string;
  in: "query" | "body" | "path";
  type: "string" | "number" | "boolean" | "array" | "object";
  required: boolean;
  description: string;
  example?: string;
};
type ApiEndpoint = { method: string; path: string; summary: string };
type ApiSpec = {
  name: string;
  description: string;
  emoji: string;
  kind: "rest" | "function";
  method: string;
  path: string;
  params: ApiParam[];
  sampleResponse: string;
  endpoints: ApiEndpoint[];
};

type ApiRow = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  kind: string;
  method: string;
  path: string;
  spec: ApiSpec;
  created_at: string;
};

type RequestRow = {
  id: string;
  method: string;
  path: string;
  request: Record<string, unknown>;
  response: Record<string, unknown>;
  status: number;
  created_at: string;
};

const METHOD_TONE: Record<string, string> = {
  GET: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
  POST: "bg-blue-500/10 text-blue-700 border-blue-500/30",
  PUT: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  PATCH: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  DELETE: "bg-rose-500/10 text-rose-700 border-rose-500/30",
};

type Tab = "playground" | "docs" | "snippets" | "history" | "schema";

function ApiPlaygroundPage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [api, setApi] = useState<ApiRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("playground");
  const [history, setHistory] = useState<RequestRow[]>([]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const [{ data: row, error }, { data: hist }] = await Promise.all([
        supabase.from("apis").select("*").eq("id", id).maybeSingle(),
        supabase.from("api_requests").select("*").eq("api_id", id).order("created_at", { ascending: false }).limit(50),
      ]);
      if (cancelled) return;
      if (error || !row) {
        toast.error(error?.message ?? "API not found");
        navigate({ to: "/app/apis" });
        return;
      }
      setApi(row as unknown as ApiRow);
      setHistory((hist ?? []) as unknown as RequestRow[]);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [id, user, navigate]);

  if (loading || !api) {
    return (
      <div className="grid h-full place-items-center text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  const refreshHistory = async () => {
    const { data } = await supabase
      .from("api_requests").select("*").eq("api_id", id)
      .order("created_at", { ascending: false }).limit(50);
    setHistory((data ?? []) as unknown as RequestRow[]);
  };

  const remove = async () => {
    if (!confirm(`Delete ${api.name}?`)) return;
    await supabase.from("apis").delete().eq("id", api.id);
    toast.success("API deleted");
    navigate({ to: "/app/apis" });
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-black/5 bg-white px-6 py-4">
        <Link to="/app/apis" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3 w-3" /> All APIs
        </Link>
        <div className="mt-2 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 text-2xl">
              {api.emoji}
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{api.name}</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">{api.description}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] font-bold ${METHOD_TONE[api.method] ?? ""}`}>
                  {api.method}
                </span>
                <code className="font-mono text-xs">{api.path}</code>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  · {api.kind === "rest" ? "REST resource" : "Custom function"}
                </span>
              </div>
            </div>
          </div>
          <button onClick={remove} className="clicky-sm rounded-lg p-2 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex shrink-0 items-center gap-1 border-b border-black/5 bg-white px-4">
        {([
          { id: "playground", label: "Playground", icon: Play },
          { id: "docs", label: "Docs", icon: BookOpen },
          { id: "snippets", label: "Snippets", icon: Code2 },
          { id: "history", label: "History", icon: History },
          { id: "schema", label: "Schema", icon: Settings },
        ] as const).map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`clicky-sm relative inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition ${
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {t.label}
              {active && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary" />}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-auto bg-muted/10">
        {tab === "playground" && <Playground api={api} onRun={refreshHistory} />}
        {tab === "docs" && <Docs api={api} />}
        {tab === "snippets" && <Snippets api={api} />}
        {tab === "history" && <HistoryView rows={history} />}
        {tab === "schema" && <SchemaEditor api={api} onSave={(spec) => setApi({ ...api, spec })} />}
      </div>
    </div>
  );
}

/* ---------- Playground ---------- */

function Playground({ api, onRun }: { api: ApiRow; onRun: () => void }) {
  const spec = api.spec ?? {} as ApiSpec;
  const params = spec.params ?? [];
  const queryParams = params.filter((p) => p.in === "query");
  const bodyParams = params.filter((p) => p.in === "body");
  const pathParams = params.filter((p) => p.in === "path");

  const [values, setValues] = useState<Record<string, string>>(() => {
    const v: Record<string, string> = {};
    params.forEach((p) => { v[p.name] = p.example ?? ""; });
    return v;
  });
  const [body, setBody] = useState<string>(() => {
    if (bodyParams.length === 0) return "";
    const obj: Record<string, unknown> = {};
    bodyParams.forEach((p) => {
      obj[p.name] = p.example ? tryParse(p.example) : defaultFor(p.type);
    });
    return JSON.stringify(obj, null, 2);
  });
  const [running, setRunning] = useState(false);
  const [response, setResponse] = useState<{ status: number; body: string; ms: number } | null>(null);

  const builtPath = useMemo(() => {
    let p = api.path;
    pathParams.forEach((pp) => {
      p = p.replace(`:${pp.name}`, encodeURIComponent(values[pp.name] || `:${pp.name}`));
    });
    const qs = queryParams
      .filter((q) => values[q.name])
      .map((q) => `${q.name}=${encodeURIComponent(values[q.name])}`)
      .join("&");
    return qs ? `${p}?${qs}` : p;
  }, [api.path, pathParams, queryParams, values]);

  const run = async () => {
    setRunning(true);
    const start = performance.now();
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 400));
    let respBody = spec.sampleResponse || '{"ok":true}';
    try { respBody = JSON.stringify(JSON.parse(respBody), null, 2); } catch { /* keep as-is */ }
    const status = api.method === "POST" ? 201 : api.method === "DELETE" ? 204 : 200;
    const ms = Math.round(performance.now() - start);
    setResponse({ status, body: respBody, ms });
    setRunning(false);
    const { data: userRes } = await supabase.auth.getUser();
    if (userRes.user) {
      await supabase.from("api_requests").insert({
        user_id: userRes.user.id,
        api_id: api.id,
        method: api.method,
        path: builtPath,
        request: { params: values, body: body ? tryParse(body) : null } as never,
        response: (tryParse(respBody) ?? { raw: respBody }) as never,
        status,
      });
      onRun();
    }
  };

  return (
    <div className="grid gap-4 p-4 lg:grid-cols-2">
      {/* Request */}
      <div className="space-y-3">
        <div className="rounded-xl border border-black/5 bg-white p-4">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Request</div>
          <div className="flex items-center gap-2 rounded-lg border border-black/5 bg-muted/30 p-2">
            <span className={`shrink-0 rounded border px-2 py-1 font-mono text-xs font-bold ${METHOD_TONE[api.method] ?? ""}`}>
              {api.method}
            </span>
            <code className="min-w-0 flex-1 truncate font-mono text-xs">{builtPath}</code>
            <button
              onClick={run}
              disabled={running}
              className="clicky-sm inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
              {running ? "Sending…" : "Send"}
            </button>
          </div>
        </div>

        {pathParams.length > 0 && (
          <ParamsSection title="Path" params={pathParams} values={values} setValues={setValues} />
        )}
        {queryParams.length > 0 && (
          <ParamsSection title="Query" params={queryParams} values={values} setValues={setValues} />
        )}
        {bodyParams.length > 0 && (
          <div className="rounded-xl border border-black/5 bg-white p-4">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Body (JSON)</div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              className="w-full resize-y rounded-lg border border-black/10 bg-muted/20 p-3 font-mono text-xs outline-none focus:border-primary"
            />
          </div>
        )}
      </div>

      {/* Response */}
      <div className="space-y-3">
        <div className="rounded-xl border border-black/5 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Response</div>
            {response && (
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className={`rounded px-1.5 py-0.5 font-mono font-bold ${
                  response.status < 300 ? "bg-emerald-500/10 text-emerald-700" : "bg-rose-500/10 text-rose-700"
                }`}>
                  {response.status}
                </span>
                <span>{response.ms}ms</span>
              </div>
            )}
          </div>
          {response ? (
            <pre className="max-h-[420px] overflow-auto rounded-lg border border-black/5 bg-[oklch(0.18_0_0)] p-3 font-mono text-xs leading-relaxed text-emerald-200">
{response.body}
            </pre>
          ) : (
            <div className="grid place-items-center rounded-lg border border-dashed border-black/10 bg-muted/10 py-12 text-xs text-muted-foreground">
              Send a request to see the response
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ParamsSection({ title, params, values, setValues }: {
  title: string;
  params: ApiParam[];
  values: Record<string, string>;
  setValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  return (
    <div className="rounded-xl border border-black/5 bg-white p-4">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      <div className="space-y-2">
        {params.map((p) => (
          <div key={p.name} className="grid grid-cols-3 items-center gap-2">
            <label className="flex items-center gap-1 text-xs">
              <code className="font-mono font-semibold">{p.name}</code>
              {p.required && <span className="text-rose-600">*</span>}
              <span className="text-[10px] text-muted-foreground">{p.type}</span>
            </label>
            <input
              value={values[p.name] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [p.name]: e.target.value }))}
              placeholder={p.example ?? p.description}
              className="col-span-2 rounded-md border border-black/10 bg-muted/20 px-2 py-1 text-xs outline-none focus:border-primary"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Docs ---------- */

function Docs({ api }: { api: ApiRow }) {
  const spec = api.spec;
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <section>
        <h2 className="text-lg font-semibold">Overview</h2>
        <p className="mt-1 text-sm text-muted-foreground">{spec.description}</p>
      </section>

      <section>
        <h3 className="text-sm font-semibold">Endpoints</h3>
        <div className="mt-2 space-y-1.5">
          {(spec.endpoints ?? []).map((ep, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-black/5 bg-white px-3 py-2 text-xs">
              <span className={`shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px] font-bold ${METHOD_TONE[ep.method] ?? ""}`}>
                {ep.method}
              </span>
              <code className="font-mono">{ep.path}</code>
              <span className="ml-auto text-muted-foreground">{ep.summary}</span>
            </div>
          ))}
        </div>
      </section>

      {spec.params?.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold">Parameters</h3>
          <div className="mt-2 overflow-hidden rounded-lg border border-black/5 bg-white">
            <table className="w-full text-xs">
              <thead className="bg-muted/30 text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">In</th>
                  <th className="px-3 py-2 text-left">Type</th>
                  <th className="px-3 py-2 text-left">Required</th>
                  <th className="px-3 py-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {spec.params.map((p) => (
                  <tr key={p.name} className="border-t border-black/5">
                    <td className="px-3 py-2 font-mono font-semibold">{p.name}</td>
                    <td className="px-3 py-2">{p.in}</td>
                    <td className="px-3 py-2">{p.type}</td>
                    <td className="px-3 py-2">{p.required ? "yes" : "no"}</td>
                    <td className="px-3 py-2 text-muted-foreground">{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section>
        <h3 className="text-sm font-semibold">Sample response</h3>
        <pre className="mt-2 overflow-auto rounded-lg border border-black/5 bg-[oklch(0.18_0_0)] p-3 font-mono text-xs leading-relaxed text-emerald-200">
{prettify(spec.sampleResponse)}
        </pre>
      </section>
    </div>
  );
}

/* ---------- Snippets ---------- */

function Snippets({ api }: { api: ApiRow }) {
  const base = typeof window !== "undefined" ? window.location.origin : "https://yourapp.com";
  const url = `${base}${api.path}`;
  const body = (api.spec.params ?? []).filter((p) => p.in === "body").length > 0 ? "{ /* body */ }" : null;

  const snippets = {
    curl: `curl -X ${api.method} '${url}'${body ? ` \\\n  -H 'Content-Type: application/json' \\\n  -d '${body}'` : ""}`,
    js: `const res = await fetch("${url}", {\n  method: "${api.method}",${body ? `\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify(${body}),` : ""}\n});\nconst data = await res.json();`,
    python: `import requests\nres = requests.${api.method.toLowerCase()}(\n  "${url}",${body ? `\n  json=${body},` : ""}\n)\ndata = res.json()`,
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-6">
      {(Object.entries(snippets) as [keyof typeof snippets, string][]).map(([lang, code]) => (
        <SnippetBlock key={lang} lang={lang} code={code} />
      ))}
    </div>
  );
}

function SnippetBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="overflow-hidden rounded-xl border border-black/5 bg-white">
      <div className="flex items-center justify-between border-b border-black/5 bg-muted/30 px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{lang}</span>
        <button onClick={copy} className="clicky-sm inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs hover:bg-black/5">
          {copied ? <><Check className="h-3 w-3 text-emerald-600" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
        </button>
      </div>
      <pre className="overflow-auto bg-[oklch(0.18_0_0)] p-3 font-mono text-xs leading-relaxed text-emerald-200">{code}</pre>
    </div>
  );
}

/* ---------- History ---------- */

function HistoryView({ rows }: { rows: RequestRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="grid place-items-center py-20 text-center text-sm text-muted-foreground">
        No requests yet — try the playground.
      </div>
    );
  }
  return (
    <div className="space-y-2 p-4">
      {rows.map((r) => (
        <details key={r.id} className="group rounded-xl border border-black/5 bg-white">
          <summary className="flex cursor-pointer items-center gap-2 px-3 py-2 text-xs">
            <span className={`shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px] font-bold ${METHOD_TONE[r.method] ?? ""}`}>
              {r.method}
            </span>
            <code className="min-w-0 flex-1 truncate font-mono">{r.path}</code>
            <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
              r.status < 300 ? "bg-emerald-500/10 text-emerald-700" : "bg-rose-500/10 text-rose-700"
            }`}>{r.status}</span>
            <span className="text-[10px] text-muted-foreground">{new Date(r.created_at).toLocaleTimeString()}</span>
          </summary>
          <div className="grid gap-2 border-t border-black/5 p-3 sm:grid-cols-2">
            <div>
              <div className="mb-1 text-[10px] font-semibold uppercase text-muted-foreground">Request</div>
              <pre className="overflow-auto rounded bg-muted/30 p-2 font-mono text-[11px]">{JSON.stringify(r.request, null, 2)}</pre>
            </div>
            <div>
              <div className="mb-1 text-[10px] font-semibold uppercase text-muted-foreground">Response</div>
              <pre className="overflow-auto rounded bg-muted/30 p-2 font-mono text-[11px]">{JSON.stringify(r.response, null, 2)}</pre>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}

/* ---------- Schema editor ---------- */

function SchemaEditor({ api, onSave }: { api: ApiRow; onSave: (spec: ApiSpec) => void }) {
  const [text, setText] = useState(() => JSON.stringify(api.spec, null, 2));
  const [busy, setBusy] = useState(false);

  const save = async () => {
    let parsed: ApiSpec;
    try { parsed = JSON.parse(text); } catch { toast.error("Invalid JSON"); return; }
    setBusy(true);
    const { error } = await supabase.from("apis").update({
      spec: parsed as never,
      name: parsed.name ?? api.name,
      description: parsed.description ?? api.description,
      method: parsed.method ?? api.method,
      path: parsed.path ?? api.path,
      emoji: parsed.emoji ?? api.emoji,
    }).eq("id", api.id);
    setBusy(false);
    if (error) toast.error(error.message);
    else { toast.success("Schema saved"); onSave(parsed); }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-3 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-1.5"><Server className="h-4 w-4" /> Schema</h3>
          <p className="text-xs text-muted-foreground">Edit the full API spec. Saved as JSON.</p>
        </div>
        <button
          onClick={save}
          disabled={busy}
          className="clicky-sm inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
          Save
        </button>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={24}
        className="w-full resize-y rounded-xl border border-black/10 bg-[oklch(0.18_0_0)] p-4 font-mono text-xs leading-relaxed text-emerald-200 outline-none focus:border-primary"
        spellCheck={false}
      />
    </div>
  );
}

/* ---------- helpers ---------- */

function tryParse(s: string): unknown {
  try { return JSON.parse(s); } catch { return s; }
}
function prettify(s: string): string {
  try { return JSON.stringify(JSON.parse(s), null, 2); } catch { return s; }
}
function defaultFor(t: ApiParam["type"]): unknown {
  switch (t) {
    case "number": return 0;
    case "boolean": return false;
    case "array": return [];
    case "object": return {};
    default: return "";
  }
}
