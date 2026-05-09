
CREATE TABLE public.waitlist_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  email TEXT NOT NULL,
  full_name TEXT,
  business TEXT,
  goal TEXT,
  phone TEXT,
  linkedin TEXT,
  referral_source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.waitlist_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone (anon or authed) can submit
CREATE POLICY "anyone can insert waitlist"
ON public.waitlist_submissions
FOR INSERT
WITH CHECK (true);

-- Users can view their own submission
CREATE POLICY "users view own submission"
ON public.waitlist_submissions
FOR SELECT
USING (auth.uid() = user_id);

-- Admin (aalang@ucsc.edu) can view all
CREATE POLICY "admin views all submissions"
ON public.waitlist_submissions
FOR SELECT
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid()) = 'aalang@ucsc.edu'
);
