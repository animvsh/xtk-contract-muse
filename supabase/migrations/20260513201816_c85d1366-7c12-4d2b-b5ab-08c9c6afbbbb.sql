ALTER TABLE public.connections
DROP CONSTRAINT IF EXISTS connections_service_id_key;

DROP INDEX IF EXISTS public.connections_service_id_key;

CREATE UNIQUE INDEX IF NOT EXISTS connections_user_service_unique
ON public.connections (user_id, service_id)
WHERE user_id IS NOT NULL;