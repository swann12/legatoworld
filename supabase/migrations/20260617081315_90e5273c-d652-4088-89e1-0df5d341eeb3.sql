CREATE TABLE public.emotional_state (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood text,
  intensity smallint,
  tags text[] NOT NULL DEFAULT '{}',
  source text,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX emotional_state_user_created_idx ON public.emotional_state(user_id, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.emotional_state TO authenticated;
GRANT ALL ON public.emotional_state TO service_role;

ALTER TABLE public.emotional_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own emotional rows select" ON public.emotional_state FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own emotional rows insert" ON public.emotional_state FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own emotional rows update" ON public.emotional_state FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own emotional rows delete" ON public.emotional_state FOR DELETE TO authenticated USING (auth.uid() = user_id);