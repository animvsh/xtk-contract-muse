DROP POLICY IF EXISTS "admin views all submissions" ON public.waitlist_submissions;
CREATE POLICY "admin views all submissions"
ON public.waitlist_submissions
FOR SELECT
USING ((auth.jwt() ->> 'email') = 'aalang@ucsc.edu');