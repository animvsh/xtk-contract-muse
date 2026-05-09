
CREATE TABLE public.apis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  emoji TEXT NOT NULL DEFAULT '🛰️',
  kind TEXT NOT NULL DEFAULT 'rest',
  method TEXT NOT NULL DEFAULT 'GET',
  path TEXT NOT NULL,
  spec JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.apis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner all" ON public.apis FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER apis_updated_at BEFORE UPDATE ON public.apis FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.api_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  api_id UUID NOT NULL,
  method TEXT NOT NULL,
  path TEXT NOT NULL,
  request JSONB NOT NULL DEFAULT '{}'::jsonb,
  response JSONB NOT NULL DEFAULT '{}'::jsonb,
  status INTEGER NOT NULL DEFAULT 200,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.api_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner all" ON public.api_requests FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_api_requests_api ON public.api_requests(api_id, created_at DESC);
