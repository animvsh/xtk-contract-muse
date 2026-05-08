CREATE TABLE public.access_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  client TEXT NOT NULL DEFAULT 'opencode',
  scope TEXT NOT NULL DEFAULT 'workspace',
  scope_label TEXT,
  permission TEXT NOT NULL DEFAULT 'sandbox',
  safety TEXT NOT NULL DEFAULT 'balanced',
  key_prefix TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  key_plaintext TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  expires_at TIMESTAMP WITH TIME ZONE,
  last_used_at TIMESTAMP WITH TIME ZONE,
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.access_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner all" ON public.access_keys
  FOR ALL TO public
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_access_keys_updated_at
BEFORE UPDATE ON public.access_keys
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.access_key_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  access_key_id UUID NOT NULL REFERENCES public.access_keys(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.access_key_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner all" ON public.access_key_events
  FOR ALL TO public
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);