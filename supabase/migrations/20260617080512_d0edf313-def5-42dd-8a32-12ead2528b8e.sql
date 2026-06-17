
-- Circles & collaboration schema

CREATE TYPE public.circle_member_role AS ENUM ('owner','proche','aidant');
CREATE TYPE public.circle_member_status AS ENUM ('invited','active','revoked');
CREATE TYPE public.shared_item_kind AS ENUM ('task','memory','text','wish','doc','note');
CREATE TYPE public.shared_item_status AS ENUM ('open','in_progress','blocked','done','delegated');

CREATE TABLE public.circles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  defunt_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.circle_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id uuid NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  role public.circle_member_role NOT NULL DEFAULT 'proche',
  status public.circle_member_status NOT NULL DEFAULT 'invited',
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (circle_id, user_id),
  UNIQUE (circle_id, email)
);

CREATE TABLE public.circle_invites (
  token text PRIMARY KEY,
  circle_id uuid NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
  email text,
  invited_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.circle_member_role NOT NULL DEFAULT 'proche',
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.shared_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id uuid NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
  kind public.shared_item_kind NOT NULL,
  title text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assignee_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status public.shared_item_status,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- GRANTS (required)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.circles TO authenticated;
GRANT ALL ON public.circles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.circle_members TO authenticated;
GRANT ALL ON public.circle_members TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.circle_invites TO authenticated;
GRANT ALL ON public.circle_invites TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shared_items TO authenticated;
GRANT ALL ON public.shared_items TO service_role;

ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_items ENABLE ROW LEVEL SECURITY;

-- Security definer helper: is the user an active member of the circle?
CREATE OR REPLACE FUNCTION public.is_circle_member(_user_id uuid, _circle_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.circle_members
    WHERE circle_id = _circle_id AND user_id = _user_id AND status = 'active'
  )
$$;

CREATE OR REPLACE FUNCTION public.is_circle_owner(_user_id uuid, _circle_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.circles WHERE id = _circle_id AND owner_id = _user_id
  )
$$;

-- Circles policies
CREATE POLICY "Members can view their circles" ON public.circles
  FOR SELECT TO authenticated
  USING (public.is_circle_member(auth.uid(), id) OR owner_id = auth.uid());
CREATE POLICY "Users can create their own circles" ON public.circles
  FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owners can update their circles" ON public.circles
  FOR UPDATE TO authenticated USING (owner_id = auth.uid());
CREATE POLICY "Owners can delete their circles" ON public.circles
  FOR DELETE TO authenticated USING (owner_id = auth.uid());

-- circle_members policies
CREATE POLICY "Members view their circle members" ON public.circle_members
  FOR SELECT TO authenticated
  USING (public.is_circle_member(auth.uid(), circle_id) OR public.is_circle_owner(auth.uid(), circle_id) OR user_id = auth.uid());
CREATE POLICY "Owners manage members" ON public.circle_members
  FOR ALL TO authenticated
  USING (public.is_circle_owner(auth.uid(), circle_id))
  WITH CHECK (public.is_circle_owner(auth.uid(), circle_id));
CREATE POLICY "Self can accept own membership" ON public.circle_members
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- circle_invites policies
CREATE POLICY "Owners view their invites" ON public.circle_invites
  FOR SELECT TO authenticated
  USING (public.is_circle_owner(auth.uid(), circle_id));
CREATE POLICY "Owners create invites" ON public.circle_invites
  FOR INSERT TO authenticated
  WITH CHECK (public.is_circle_owner(auth.uid(), circle_id) AND invited_by = auth.uid());
CREATE POLICY "Owners delete invites" ON public.circle_invites
  FOR DELETE TO authenticated
  USING (public.is_circle_owner(auth.uid(), circle_id));

-- shared_items policies
CREATE POLICY "Members view shared items" ON public.shared_items
  FOR SELECT TO authenticated
  USING (public.is_circle_member(auth.uid(), circle_id) OR public.is_circle_owner(auth.uid(), circle_id));
CREATE POLICY "Members create shared items" ON public.shared_items
  FOR INSERT TO authenticated
  WITH CHECK ((public.is_circle_member(auth.uid(), circle_id) OR public.is_circle_owner(auth.uid(), circle_id)) AND author_id = auth.uid());
CREATE POLICY "Author or assignee can update" ON public.shared_items
  FOR UPDATE TO authenticated
  USING (author_id = auth.uid() OR assignee_id = auth.uid() OR public.is_circle_owner(auth.uid(), circle_id));
CREATE POLICY "Author or owner can delete" ON public.shared_items
  FOR DELETE TO authenticated
  USING (author_id = auth.uid() OR public.is_circle_owner(auth.uid(), circle_id));

-- Updated_at triggers
CREATE TRIGGER trg_circles_updated_at BEFORE UPDATE ON public.circles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_shared_items_updated_at BEFORE UPDATE ON public.shared_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create a personal circle + owner membership on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_circle()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  new_circle_id uuid;
BEGIN
  INSERT INTO public.circles (owner_id, name)
  VALUES (NEW.id, 'Mon cercle')
  RETURNING id INTO new_circle_id;

  INSERT INTO public.circle_members (circle_id, user_id, email, role, status, display_name)
  VALUES (new_circle_id, NEW.id, NEW.email, 'owner', 'active',
          COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_circle ON auth.users;
CREATE TRIGGER on_auth_user_created_circle
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_circle();
