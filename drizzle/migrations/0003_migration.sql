CREATE TABLE public.help_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  token_hash text NOT NULL UNIQUE,
  sender_name text NOT NULL DEFAULT '',
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  dates jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT now() + interval '30 days'
);
GRANT SELECT, DELETE ON public.help_links TO authenticated;
GRANT ALL ON public.help_links TO service_role;
ALTER TABLE public.help_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner reads own help links" ON public.help_links FOR SELECT TO authenticated USING (owner_id = auth.uid());
CREATE POLICY "owner deletes own help links" ON public.help_links FOR DELETE TO authenticated USING (owner_id = auth.uid());

CREATE TABLE public.help_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id uuid NOT NULL REFERENCES public.help_links(id) ON DELETE CASCADE,
  item_id text NOT NULL,
  helper_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (link_id, item_id)
);
GRANT SELECT ON public.help_claims TO authenticated;
GRANT ALL ON public.help_claims TO service_role;
ALTER TABLE public.help_claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner reads claims" ON public.help_claims FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.help_links l WHERE l.id = link_id AND l.owner_id = auth.uid()));

-- Création par le propriétaire : le jeton n'est rendu qu'une fois, seule son empreinte est gardée.
CREATE OR REPLACE FUNCTION public.create_help_link(p_name text, p_items jsonb, p_dates jsonb)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
DECLARE v_token text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'auth required'; END IF;
  IF jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) > 30 THEN RAISE EXCEPTION 'invalid items'; END IF;
  IF jsonb_typeof(p_dates) <> 'array' OR jsonb_array_length(p_dates) > 10 THEN RAISE EXCEPTION 'invalid dates'; END IF;
  v_token := translate(encode(gen_random_bytes(24), 'base64'), '+/=', '-_');
  INSERT INTO public.help_links(owner_id, token_hash, sender_name, items, dates)
  VALUES (auth.uid(), encode(digest(v_token, 'sha256'), 'hex'), left(coalesce(p_name, ''), 60), p_items, p_dates);
  RETURN v_token;
END $$;
REVOKE ALL ON FUNCTION public.create_help_link(text, jsonb, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_help_link(text, jsonb, jsonb) TO authenticated;

-- Lecture publique par lien : seulement la liste, les dates partagées et les prénoms de ceux qui s'en occupent.
CREATE OR REPLACE FUNCTION public.get_help_link(p_token text)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, extensions AS $$
  SELECT jsonb_build_object(
    'sender_name', l.sender_name, 'items', l.items, 'dates', l.dates, 'expires_at', l.expires_at,
    'claims', coalesce((SELECT jsonb_object_agg(c.item_id, c.helper_name) FROM public.help_claims c WHERE c.link_id = l.id), '{}'::jsonb))
  FROM public.help_links l
  WHERE l.token_hash = encode(digest(coalesce(p_token, ''), 'sha256'), 'hex') AND l.expires_at > now();
$$;
GRANT EXECUTE ON FUNCTION public.get_help_link(text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.claim_help_item(p_token text, p_item text, p_name text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
DECLARE v_link public.help_links;
BEGIN
  SELECT * INTO v_link FROM public.help_links
  WHERE token_hash = encode(digest(coalesce(p_token, ''), 'sha256'), 'hex') AND expires_at > now();
  IF v_link.id IS NULL THEN RETURN false; END IF;
  IF NOT EXISTS (SELECT 1 FROM jsonb_array_elements(v_link.items) e WHERE e->>'id' = p_item) THEN RETURN false; END IF;
  IF length(trim(coalesce(p_name, ''))) = 0 THEN RETURN false; END IF;
  INSERT INTO public.help_claims(link_id, item_id, helper_name) VALUES (v_link.id, p_item, left(trim(p_name), 40))
  ON CONFLICT (link_id, item_id) DO NOTHING;
  RETURN FOUND;
END $$;
GRANT EXECUTE ON FUNCTION public.claim_help_item(text, text, text) TO anon, authenticated;