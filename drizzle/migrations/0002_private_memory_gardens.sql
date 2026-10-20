ALTER TABLE public.circles ADD COLUMN IF NOT EXISTS memory_space_key text;
CREATE UNIQUE INDEX IF NOT EXISTS circles_memory_space_owner ON public.circles(owner_id, memory_space_key) WHERE memory_space_key IS NOT NULL;
CREATE TABLE public.garden_memories (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), circle_id uuid NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
 author_id uuid NOT NULL, status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
 shared boolean NOT NULL DEFAULT false, payload jsonb NOT NULL DEFAULT '{}'::jsonb,
 file_path text, created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.garden_memories TO authenticated;
GRANT ALL ON public.garden_memories TO service_role;
ALTER TABLE public.garden_memories ENABLE ROW LEVEL SECURITY;
CREATE POLICY garden_memory_read ON public.garden_memories FOR SELECT TO authenticated USING (public.is_circle_owner(auth.uid(),circle_id) OR author_id=auth.uid() OR (status='approved' AND shared AND public.is_circle_member(auth.uid(),circle_id)));
CREATE POLICY garden_memory_insert ON public.garden_memories FOR INSERT TO authenticated WITH CHECK (author_id=auth.uid() AND ((public.is_circle_owner(auth.uid(),circle_id) AND status='approved') OR (public.is_circle_member(auth.uid(),circle_id) AND status='pending' AND shared)));
CREATE POLICY garden_memory_update ON public.garden_memories FOR UPDATE TO authenticated USING (public.is_circle_owner(auth.uid(),circle_id)) WITH CHECK (public.is_circle_owner(auth.uid(),circle_id));
CREATE POLICY garden_memory_delete ON public.garden_memories FOR DELETE TO authenticated USING (public.is_circle_owner(auth.uid(),circle_id));
CREATE FUNCTION public.garden_memory_guard() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN
 IF TG_OP='UPDATE' AND (NEW.id<>OLD.id OR NEW.circle_id<>OLD.circle_id OR NEW.author_id<>OLD.author_id OR NEW.created_at<>OLD.created_at) THEN RAISE EXCEPTION 'Memory identity cannot change'; END IF;
 IF NEW.file_path IS NOT NULL AND NEW.file_path NOT LIKE NEW.circle_id::text||'/'||NEW.id::text||'/%' THEN RAISE EXCEPTION 'Invalid memory file path'; END IF;
 IF octet_length(NEW.payload::text)>100000 THEN RAISE EXCEPTION 'Memory payload too large'; END IF;
 RETURN NEW; END $$;
CREATE TRIGGER garden_memory_guard BEFORE INSERT OR UPDATE ON public.garden_memories FOR EACH ROW EXECUTE FUNCTION public.garden_memory_guard();
CREATE POLICY garden_file_read ON storage.objects FOR SELECT TO authenticated USING (bucket_id='memory-files' AND EXISTS(SELECT 1 FROM public.garden_memories m WHERE m.file_path=name));
CREATE POLICY garden_file_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id='memory-files' AND EXISTS(SELECT 1 FROM public.garden_memories m WHERE m.file_path=name AND m.author_id=auth.uid() AND m.status IN ('approved','pending')));
CREATE POLICY garden_file_delete ON storage.objects FOR DELETE TO authenticated USING (bucket_id='memory-files' AND EXISTS(SELECT 1 FROM public.garden_memories m WHERE m.file_path=name AND public.is_circle_owner(auth.uid(),m.circle_id)));
CREATE FUNCTION public.accept_legato_invite(_token text) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE i public.circle_invites; BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
 SELECT * INTO i FROM public.circle_invites WHERE token=_token FOR UPDATE;
 IF i.token IS NULL OR i.accepted_at IS NOT NULL OR i.expires_at<=now() THEN RAISE EXCEPTION 'Invitation unavailable'; END IF;
 IF i.email IS NOT NULL AND lower(i.email)<>lower(coalesce(auth.jwt()->>'email','')) THEN RAISE EXCEPTION 'Invitation belongs to another email'; END IF;
 INSERT INTO public.circle_members(circle_id,user_id,email,role,status) VALUES(i.circle_id,auth.uid(),auth.jwt()->>'email',i.role,'active') ON CONFLICT(circle_id,user_id) DO UPDATE SET status='active',role=EXCLUDED.role;
 UPDATE public.circle_invites SET accepted_at=now() WHERE token=_token;
 RETURN i.circle_id; END $$;
REVOKE ALL ON FUNCTION public.accept_legato_invite(text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.accept_legato_invite(text) TO authenticated;