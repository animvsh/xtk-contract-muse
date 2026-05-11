import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FileText,
  Search,
  X,
  Download,
  Share2,
  Star,
  FileSpreadsheet,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  Presentation,
  FileType,
  Folder,
  Clock,
  Building2,
  Maximize2,
  Plus,
  Minus,
} from "lucide-react";

export const Route = createFileRoute("/app/files")({
  component: Files,
});

type FileKind = "doc" | "sheet" | "slide" | "pdf" | "image" | "video" | "audio" | "code" | "folder";

type FileItem = {
  id: string;
  name: string;
  kind: FileKind;
  source: "Notion" | "Drive" | "Figma" | "Dropbox" | "Local" | "GitHub";
  owner: string;
  updated: string;
  size: string;
  starred?: boolean;
  preview: string; // body for the viewer
};

const FILES: FileItem[] = [
  {
    id: "f_001",
    name: "Beevr — Employment & Hiring Policy.doc",
    kind: "doc",
    source: "Notion",
    owner: "Adithya Rao",
    updated: "2d ago",
    size: "48 KB",
    starred: true,
    preview:
      "## Beevr Employment & Hiring Policy\n\nThis document outlines the standard hiring workflow at Beevr.\n\n1. Inbound applications are screened within 48 hours.\n2. Initial screen is 30 minutes with the hiring manager.\n3. Take-home is paid at $200 and capped at 4 hours.\n4. Final loop covers craft, collaboration, and values.\n\nAll offers must be approved by the founders before being sent.",
  },
  {
    id: "f_002",
    name: "Q3 Marketing Plan.doc",
    kind: "doc",
    source: "Notion",
    owner: "Maya Chen",
    updated: "5h ago",
    size: "112 KB",
    preview:
      "## Q3 Marketing Plan\n\n**Goal:** Drive 2,500 qualified workspace signups by end of Q3.\n\n- Launch the agent showcase landing page in week 2\n- Run a paid pilot on LinkedIn targeting heads of ops at 50–500p companies\n- Publish 6 long-form case studies\n- Founder podcast tour — book 8 shows",
  },
  {
    id: "f_003",
    name: "Pricing Strategy 2026.sheet",
    kind: "sheet",
    source: "Drive",
    owner: "Jordan Park",
    updated: "6h ago",
    size: "204 KB",
    preview:
      "Tier        | Monthly | Seats | Agents\nStarter     | $49     | 3     | 5\nTeam        | $199    | 10    | 25\nBusiness    | $599    | 50    | unlimited\nEnterprise  | custom  | custom| custom\n\nNotes: Team is the volume sweet spot. Compress Starter cap to push upgrades.",
  },
  {
    id: "f_004",
    name: "Brand Guidelines.fig",
    kind: "image",
    source: "Figma",
    owner: "Lena Park",
    updated: "2w ago",
    size: "8.4 MB",
    preview:
      "Primary palette: oklch(0.68 0.22 40) (Beevr Orange), oklch(0.04 0 0) (Black).\n\nTypography: Inter for UI, Söhne for marketing.\n\nLogo clearspace: 1x the height of the bee mark on every side.",
  },
  {
    id: "f_005",
    name: "Customer Interview — Acme Corp.doc",
    kind: "doc",
    source: "Drive",
    owner: "Priya Shah",
    updated: "3d ago",
    size: "36 KB",
    preview:
      "## Acme Corp — 30 min interview\n\n**Pain:** Their ops team is drowning in Slack triage.\n**Wishlist:** Auto-summarize threads, route to the right channel, file follow-ups.\n**Budget:** ~$2k/mo if it removes one FTE of toil.\n**Next step:** Send a pilot proposal by Friday.",
  },
  {
    id: "f_006",
    name: "Investor Update — Nov.pdf",
    kind: "pdf",
    source: "Drive",
    owner: "Adithya Rao",
    updated: "1d ago",
    size: "1.2 MB",
    starred: true,
    preview:
      "Beevr — November Investor Update\n\nMRR: $128k (+18% MoM)\nWorkspaces: 412\nNet retention: 138%\nRunway: 22 months\n\nBig wins: Acme pilot signed, hired Maya as Head of Marketing, launched Workspaces v2.",
  },
  {
    id: "f_007",
    name: "Onboarding Walkthrough.mp4",
    kind: "video",
    source: "Dropbox",
    owner: "Sam Whitfield",
    updated: "4d ago",
    size: "84 MB",
    preview:
      "Recorded walkthrough of the Beevr onboarding flow. 6:42 in length. Covers workspace creation, first agent, connecting Slack, and inviting teammates.",
  },
  {
    id: "f_008",
    name: "Launch Deck.slide",
    kind: "slide",
    source: "Drive",
    owner: "Maya Chen",
    updated: "12h ago",
    size: "5.6 MB",
    preview:
      "Slide 1 — The problem: every company runs on tribal knowledge.\nSlide 2 — Beevr: an AI brain that knows your company.\nSlide 3 — Demo.\nSlide 4 — Traction.\nSlide 5 — The team.\nSlide 6 — The ask: $4M seed.",
  },
  {
    id: "f_009",
    name: "Office Photo — All Hands.jpg",
    kind: "image",
    source: "Local",
    owner: "Lena Park",
    updated: "1w ago",
    size: "2.1 MB",
    preview: "Photo of the Beevr team at the November all-hands offsite. 14 people, sunny.",
  },
  {
    id: "f_010",
    name: "agents.config.ts",
    kind: "code",
    source: "GitHub",
    owner: "Jordan Park",
    updated: "3h ago",
    size: "12 KB",
    preview:
      "export const AGENTS = [\n  { id: 'sales-digest', name: 'Sales Digest', schedule: 'weekly' },\n  { id: 'inbox-triage', name: 'Inbox Triage', schedule: 'realtime' },\n  { id: 'investor-update', name: 'Investor Update', schedule: 'monthly' },\n];",
  },
  {
    id: "f_011",
    name: "Sales Call — Globex.mp3",
    kind: "audio",
    source: "Dropbox",
    owner: "Jordan Park",
    updated: "2d ago",
    size: "18 MB",
    preview:
      "Audio recording of the Globex discovery call. 32:14 in length. Auto-transcribed; transcript indexed in the brain.",
  },
  {
    id: "f_012",
    name: "Customer Contracts",
    kind: "folder",
    source: "Drive",
    owner: "Adithya Rao",
    updated: "5h ago",
    size: "24 files",
    preview: "Folder containing all signed customer contracts, organized by quarter.",
  },
];

const KIND_META: Record<
  FileKind,
  { icon: typeof FileText; tone: string; label: string }
> = {
  doc: { icon: FileText, tone: "oklch(0.55 0.2 250)", label: "Document" },
  sheet: { icon: FileSpreadsheet, tone: "oklch(0.6 0.18 145)", label: "Spreadsheet" },
  slide: { icon: Presentation, tone: "oklch(0.65 0.2 35)", label: "Slides" },
  pdf: { icon: FileType, tone: "oklch(0.6 0.22 25)", label: "PDF" },
  image: { icon: FileImage, tone: "oklch(0.65 0.2 320)", label: "Image" },
  video: { icon: FileVideo, tone: "oklch(0.55 0.22 280)", label: "Video" },
  audio: { icon: FileAudio, tone: "oklch(0.6 0.18 200)", label: "Audio" },
  code: { icon: FileCode, tone: "oklch(0.45 0.05 250)", label: "Code" },
  folder: { icon: Folder, tone: "oklch(0.65 0.16 75)", label: "Folder" },
};

const FILTERS = ["All", "Starred", "Documents", "Spreadsheets", "Slides", "PDFs", "Images", "Media", "Code", "Folders"] as const;

function matches(f: FileItem, q: string, filter: (typeof FILTERS)[number]) {
  if (q && !f.name.toLowerCase().includes(q.toLowerCase()) && !f.owner.toLowerCase().includes(q.toLowerCase())) return false;
  if (filter === "All") return true;
  if (filter === "Starred") return !!f.starred;
  if (filter === "Documents") return f.kind === "doc";
  if (filter === "Spreadsheets") return f.kind === "sheet";
  if (filter === "Slides") return f.kind === "slide";
  if (filter === "PDFs") return f.kind === "pdf";
  if (filter === "Images") return f.kind === "image";
  if (filter === "Media") return f.kind === "video" || f.kind === "audio";
  if (filter === "Code") return f.kind === "code";
  if (filter === "Folders") return f.kind === "folder";
  return true;
}

function Files() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = useMemo(() => FILES.filter((f) => matches(f, query, filter)), [query, filter]);
  const open = openId ? FILES.find((f) => f.id === openId) ?? null : null;

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 overflow-y-auto px-6 py-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[oklch(0.68_0.22_40)]">
          <Folder className="h-3.5 w-3.5" /> Workspace files
        </div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Files</h1>
        <p className="mt-1 text-sm text-[oklch(0.4_0_0)]">
          Every file your workspace has indexed. Click one to open it.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-black/10 bg-white/80 px-3 py-2 shadow-sm focus-within:border-[oklch(0.68_0.22_40)]/40">
          <Search className="h-4 w-4 text-[oklch(0.5_0_0)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files or owners…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[oklch(0.55_0_0)]"
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`clicky clicky-sm rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              filter === f
                ? "border-[oklch(0.68_0.22_40)] bg-[oklch(0.68_0.22_40)] text-white"
                : "border-black/10 bg-white/70 text-[oklch(0.3_0_0)] hover:bg-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((f) => {
          const meta = KIND_META[f.kind];
          const Icon = meta.icon;
          return (
            <button
              key={f.id}
              onClick={() => setOpenId(f.id)}
              className="clicky group relative flex flex-col gap-3 rounded-2xl border border-black/5 bg-white/70 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[oklch(0.68_0.22_40)]/30 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm"
                  style={{ background: meta.tone }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                {f.starred && (
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                )}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-[oklch(0.2_0_0)]">{f.name}</div>
                <div className="mt-0.5 text-[11px] text-[oklch(0.5_0_0)]">
                  {f.source} · {f.owner}
                </div>
              </div>
              <div className="mt-auto flex items-center justify-between text-[11px] text-[oklch(0.5_0_0)]">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {f.updated}
                </span>
                <span>{f.size}</span>
              </div>
            </button>
          );
        })}
        {visible.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-black/10 bg-white/40 p-10 text-center text-sm text-[oklch(0.45_0_0)]">
            No files match.
          </div>
        )}
      </div>

      {open && <FileViewer file={open} onClose={() => setOpenId(null)} />}
    </div>
  );
}

function FileViewer({ file, onClose }: { file: FileItem; onClose: () => void }) {
  const meta = KIND_META[file.kind];
  const Icon = meta.icon;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-[fadeInUp_140ms_ease-out]"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        style={{ maxHeight: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-black/5 px-5 py-4">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
            style={{ background: meta.tone }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-base font-semibold text-[oklch(0.15_0_0)]">{file.name}</div>
            <div className="mt-0.5 text-[11px] text-[oklch(0.5_0_0)]">
              {meta.label} · {file.source} · {file.owner} · updated {file.updated} · {file.size}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="clicky clicky-sm rounded-lg p-2 text-[oklch(0.4_0_0)] hover:bg-black/5" title="Share">
              <Share2 className="h-4 w-4" />
            </button>
            <button className="clicky clicky-sm rounded-lg p-2 text-[oklch(0.4_0_0)] hover:bg-black/5" title="Download">
              <Download className="h-4 w-4" />
            </button>
            <button onClick={onClose} className="clicky clicky-sm rounded-lg p-2 text-[oklch(0.4_0_0)] hover:bg-black/5" title="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-[oklch(0.98_0.01_85)] p-6">
          <FilePreview file={file} />
        </div>
      </div>
    </div>
  );
}

function FilePreview({ file }: { file: FileItem }) {
  const meta = KIND_META[file.kind];
  if (file.kind === "image") {
    return (
      <div className="flex flex-col items-center gap-4">
        <div
          className="flex h-72 w-full items-center justify-center rounded-xl text-white shadow-inner"
          style={{
            background: meta.tone,
          }}
        >
          <FileImage className="h-16 w-16 opacity-90" />
        </div>
        <p className="max-w-md text-center text-sm leading-relaxed text-[oklch(0.4_0_0)]">{file.preview}</p>
      </div>
    );
  }
  if (file.kind === "video" || file.kind === "audio") {
    const Icon = file.kind === "video" ? FileVideo : FileAudio;
    return (
      <div className="flex flex-col items-center gap-4">
        <div
          className="flex h-56 w-full items-center justify-center rounded-xl text-white shadow-inner"
          style={{ background: meta.tone }}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur">
            <Icon className="h-7 w-7" />
          </div>
        </div>
        <div className="h-1.5 w-full max-w-md overflow-hidden rounded-full bg-black/10">
          <div className="h-full w-1/3 rounded-full" style={{ background: meta.tone }} />
        </div>
        <p className="max-w-md text-center text-sm leading-relaxed text-[oklch(0.4_0_0)]">{file.preview}</p>
      </div>
    );
  }
  if (file.kind === "code") {
    return (
      <pre className="overflow-x-auto rounded-xl bg-[oklch(0.18_0.02_250)] p-5 text-[12px] leading-relaxed text-[oklch(0.85_0.02_85)]">
        <code>{file.preview}</code>
      </pre>
    );
  }
  if (file.kind === "sheet") {
    const lines = file.preview.split("\n");
    const rows = lines.filter((l) => l.includes("|")).map((l) => l.split("|").map((c) => c.trim()));
    const notes = lines.filter((l) => !l.includes("|") && l.trim()).join("\n");
    return (
      <div className="space-y-4">
        <div className="overflow-hidden rounded-xl border border-black/10 bg-white">
          <table className="w-full text-left text-sm">
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className={i === 0 ? "bg-[oklch(0.97_0.02_85)] font-semibold" : "border-t border-black/5"}>
                  {r.map((c, j) => (
                    <td key={j} className="px-4 py-2 tabular-nums text-[oklch(0.25_0_0)]">{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {notes && <p className="text-sm text-[oklch(0.4_0_0)]">{notes}</p>}
      </div>
    );
  }
  if (file.kind === "folder") {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-2xl text-white shadow-md"
          style={{ background: meta.tone }}
        >
          <Folder className="h-10 w-10" />
        </div>
        <p className="max-w-md text-sm text-[oklch(0.4_0_0)]">{file.preview}</p>
      </div>
    );
  }
  // doc, pdf, slide → render preview text as a simple document
  return (
    <article className="prose prose-sm mx-auto max-w-none rounded-xl border border-black/5 bg-white p-6 text-[oklch(0.2_0_0)] shadow-sm">
      {file.preview.split("\n").map((line, i) => {
        if (line.startsWith("## ")) return <h2 key={i} className="mt-4 text-lg font-semibold first:mt-0">{line.slice(3)}</h2>;
        if (line.startsWith("- ")) return <div key={i} className="ml-4 mt-1 text-sm">• {line.slice(2)}</div>;
        if (/^\d+\./.test(line)) return <div key={i} className="ml-4 mt-1 text-sm">{line}</div>;
        if (!line.trim()) return <div key={i} className="h-2" />;
        return <p key={i} className="mt-2 text-sm leading-relaxed">{line}</p>;
      })}
    </article>
  );
}
