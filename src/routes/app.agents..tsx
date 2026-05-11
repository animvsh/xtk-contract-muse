
// Normalize agent specs created from the chat brain (different shape) into the
// shape this page expects: { trigger:{type,description}, steps:[...] }
type ChatBrainSpec = {
  name?: string;
  description?: string;
  emoji?: string;
  schedule?: { cadence?: string; timeOfDay?: string };
  trigger?: unknown;
  action?: string;
  dataSources?: string[];
  channel?: string;
  recipient?: string;
  tools?: string[];
};

function normalizeAgent(a: Agent): Agent {
  const raw = (a.spec ?? {}) as unknown as ChatBrainSpec & Partial<AgentSpec>;
  const trig = raw.trigger;
  const hasObjectTrigger =
    trig && typeof trig === "object" && "type" in (trig as object) && "description" in (trig as object);
  const hasArraySteps = Array.isArray((raw as Partial<AgentSpec>).steps);

  if (hasObjectTrigger && hasArraySteps) return a;

  // Derive trigger
  let trigger: AgentTrigger;
  if (hasObjectTrigger) {
    trigger = trig as AgentTrigger;
  } else if (raw.schedule?.cadence) {
    const cadence = raw.schedule.cadence;
    const time = raw.schedule.timeOfDay ?? "09:00";
    const desc =
      typeof trig === "string" && trig
        ? trig
        : `${cadence === "weekdays" ? "Weekdays" : cadence.charAt(0).toUpperCase() + cadence.slice(1)} at ${time}`;
    trigger = { type: "schedule", description: desc };
  } else if (typeof trig === "string" && trig) {
    trigger = { type: "manual", description: trig };
  } else {
    trigger = { type: "manual", description: "Run on demand" };
  }

  // Derive steps from dataSources + tools + action
  const steps: AgentStep[] = [];
  for (const src of raw.dataSources ?? []) {
    const integration = src.split(/[ (]/)[0] || "Source";
    steps.push({ title: `Read from ${integration}`, integration, action: src });
  }
  for (const tool of raw.tools ?? []) {
    if ((raw.dataSources ?? []).some((d) => d.startsWith(tool))) continue;
    steps.push({ title: `Use ${tool}`, integration: tool, action: `Call ${tool} API` });
  }
  if (raw.action) {
    const channel = raw.channel ?? "in-app";
    const integration =
      channel === "sms" ? "Twilio" : channel === "email" ? "Gmail" : channel === "slack" ? "Slack" : "Beevr";
    steps.push({
      title: `Send via ${integration}`,
      integration,
      action: raw.recipient ? `${raw.action} → ${raw.recipient}` : raw.action,
    });
  }
  if (steps.length === 0) {
    steps.push({ title: "Run", integration: "Beevr", action: "Execute agent" });
  }

  return { ...a, spec: { ...(a.spec as object), trigger, steps } as AgentSpec };
}
