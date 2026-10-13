CREATE OR REPLACE FUNCTION public.accept_circle_task(_item uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE n int;
BEGIN
  UPDATE public.shared_items SET assignee_id = auth.uid(), status = 'in_progress', updated_at = now()
  WHERE id = _item AND kind = 'task' AND status = 'open' AND assignee_id IS NULL
    AND (public.is_circle_member(auth.uid(), circle_id) OR public.is_circle_owner(auth.uid(), circle_id));
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n > 0;
END $$;
REVOKE ALL ON FUNCTION public.accept_circle_task(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.accept_circle_task(uuid) TO authenticated;