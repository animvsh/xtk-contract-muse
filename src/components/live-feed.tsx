import { useEffect, useState } from "react";
import { FileText, MessageSquare, Mail, GitBranch, Calendar, DollarSign, Users, Zap, Bot } from "lucide-react";

type Update = {
  id: string;
  icon: typeof FileText;
  source: string;
  text: string;
  color: string;
};

const POOL: Omit<Update, "id">[] = [
  { icon: FileText, source: "Notion", text: "Adithya created 'Q4 Hiring Plan'", color: "oklch(0.95 0 0)" },
  { icon: MessageSquare, source: "Slack", text: "12 new messages in #engineering", color: "oklch(0.7 0.18 320)" },
  { icon: Mail, source: "Gmail", text: "Maya replied to 'Onboarding'", color: "oklch(0.65 0.22 25)" },
  { icon: GitBranch, source: "GitHub", text: "PR #482 merged by Sarah", color: "oklch(0.95 0 0)" },
  { icon: Bot, source: "Agent", text: "Sales Digest posted weekly summary", color: "oklch(0.78 0.16 70)" },
  { icon: FileText, source: "Drive", text: "New file: 'Investor Update Nov.pdf'", color: "oklch(0.7 0.18 145)" },
  { icon: Calendar, source: "Calendar", text: "Meeting 'Design review' starts in 15m", color: "oklch(0.6 0.2 250)" },
  { icon: DollarSign, source: "Stripe", text: "$4,820 invoice paid by Acme Corp", color: "oklch(0.7 0.18 280)" },
  { icon: Users, source: "HubSpot", text: "New deal: Globex · $42k", color: "oklch(0.7 0.2 35)" },
  { icon: Zap, source: "Linear", text: "Adithya moved BEE-218 to In Progress", color: "oklch(0.6 0.2 280)" },
  { icon: MessageSquare, source: "Slack", text: "Animesh mentioned you in #product", color: "oklch(0.7 0.18 320)" },
  { icon: FileText, source: "Notion", text: "Sarah edited 'Beevr Brand Guidelines'", color: "oklch(0.95 0 0)" },
  { icon: Bot, source: "Agent", text: "Inbox Triage labeled 7 emails", color: "oklch(0.78 0.16 70)" },
  { icon: Mail, source: "Gmail", text: "Contract signed by adithya@beevr.io", color: "oklch(0.65 0.22 25)" },
];

export function LiveFeed() {
  const [items, setItems] = useState<Update[]>(() =>
    POOL.slice(0, 4).map((p, i) => ({ ...p, id: `seed-${i}` })),
  );
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    const tick = () => {
      const pick = POOL[Math.floor(Math.random() * POOL.length)];
      setItems((prev) => [{ ...pick, id: crypto.randomUUID() }, ...prev].slice(0, 12));
      setNewCount((n) => n + 1);
    };
    const schedule = () => {
      const delay = 2500 + Math.random() * 3500;
      return setTimeout(() => {
        tick();
        timer = schedule();
      }, delay);
    };
    let timer = schedule();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="hidden w-72 shrink-0 border-l border-black/5 bg-white/50 backdrop-blur lg:flex lg:flex-col">
      <div className="flex items-center justify-between border-b border-black/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[oklch(0.68_0.22_40)] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[oklch(0.68_0.22_40)]" />
          </span>
          <h3 className="text-sm font-semibold">Live activity</h3>
        </div>
        {newCount > 0 && (
          <span className="rounded-full bg-[oklch(0.68_0.22_40)]/15 px-2 py-0.5 text-[10px] font-medium text-[oklch(0.55_0.22_40)]">
            {newCount} new
          </span>
        )}
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`flex items-start gap-3 rounded-lg border border-black/5 bg-white p-3 text-xs shadow-sm ${
                idx === 0 ? "animate-in fade-in slide-in-from-top-2 ring-1 ring-[oklch(0.68_0.22_40)]/30" : ""
              }`}
            >
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white"
                style={{ backgroundColor: item.color }}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1">
                <div className="text-[oklch(0.45_0_0)]">{item.source}</div>
                <div className="mt-0.5 text-foreground">{item.text}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
