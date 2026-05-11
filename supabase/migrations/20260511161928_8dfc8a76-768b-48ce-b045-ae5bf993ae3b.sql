-- Workspace MCP servers the user creates (mock, like apis)
CREATE TABLE public.mcps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  emoji TEXT NOT NULL DEFAULT '🧩',
  spec JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mcps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner all" ON public.mcps
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER mcps_updated_at
BEFORE UPDATE ON public.mcps
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Per-tool invocation history for MCPs (mock playground runs)
CREATE TABLE public.mcp_invocations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mcp_id UUID NOT NULL REFERENCES public.mcps(id) ON DELETE CASCADE,
  tool_name TEXT NOT NULL,
  arguments JSONB NOT NULL DEFAULT '{}'::jsonb,
  result JSONB NOT NULL DEFAULT '{}'::jsonb,
  status INT NOT NULL DEFAULT 200,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mcp_invocations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner all" ON public.mcp_invocations
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX mcp_invocations_mcp_id_idx ON public.mcp_invocations(mcp_id, created_at DESC);