
-- 1. has_role: super_admin satisfaz qualquer papel
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND (role = _role OR role::text = 'master' OR role::text = 'super_admin')
  )
$$;

-- 2. Helper: is_super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role::text = 'super_admin'
  )
$$;

-- 3. owner_id em member_areas
ALTER TABLE public.member_areas ADD COLUMN IF NOT EXISTS owner_id uuid;
UPDATE public.member_areas SET owner_id = '34b60957-e37c-4667-a57e-7b02656cafdc' WHERE owner_id IS NULL;
ALTER TABLE public.member_areas ALTER COLUMN owner_id SET NOT NULL;

-- 4. area_id nas tabelas relacionadas (backfill com a única área existente)
DO $do$
DECLARE single_area uuid;
BEGIN
  SELECT id INTO single_area FROM public.member_areas LIMIT 1;
  IF single_area IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.modules ADD COLUMN IF NOT EXISTS area_id uuid';
    EXECUTE format('UPDATE public.modules SET area_id = %L WHERE area_id IS NULL', single_area);

    EXECUTE 'ALTER TABLE public.module_categories ADD COLUMN IF NOT EXISTS area_id uuid';
    EXECUTE format('UPDATE public.module_categories SET area_id = %L WHERE area_id IS NULL', single_area);

    EXECUTE 'ALTER TABLE public.member_access ADD COLUMN IF NOT EXISTS area_id uuid';
    EXECUTE format('UPDATE public.member_access SET area_id = %L WHERE area_id IS NULL', single_area);

    EXECUTE 'ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS area_id uuid';
    EXECUTE format('UPDATE public.orders SET area_id = %L WHERE area_id IS NULL', single_area);

    EXECUTE 'ALTER TABLE public.tracking_pixels ADD COLUMN IF NOT EXISTS area_id uuid';
    EXECUTE format('UPDATE public.tracking_pixels SET area_id = %L WHERE area_id IS NULL', single_area);

    EXECUTE 'ALTER TABLE public.share_links ADD COLUMN IF NOT EXISTS area_id uuid';
    EXECUTE format('UPDATE public.share_links SET area_id = %L WHERE area_id IS NULL', single_area);
  END IF;
END $do$;

-- 5. user_owns_area helper
CREATE OR REPLACE FUNCTION public.user_owns_area(_user_id uuid, _area_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT public.is_super_admin(_user_id) OR EXISTS (
    SELECT 1 FROM public.member_areas WHERE id = _area_id AND owner_id = _user_id
  )
$$;

-- 6. unique name por owner
ALTER TABLE public.member_areas DROP CONSTRAINT IF EXISTS member_areas_name_key;
ALTER TABLE public.member_areas DROP CONSTRAINT IF EXISTS member_areas_slug_key;
CREATE UNIQUE INDEX IF NOT EXISTS member_areas_owner_name_unique ON public.member_areas (owner_id, lower(name));

-- 7. Atualizar policies de member_areas para escopar por owner (super_admin vê tudo)
DROP POLICY IF EXISTS "Anyone authenticated can view member areas" ON public.member_areas;
DROP POLICY IF EXISTS "Admins manage member areas" ON public.member_areas;

CREATE POLICY "View own areas or super admin"
  ON public.member_areas FOR SELECT TO authenticated
  USING (owner_id = auth.uid() OR public.is_super_admin(auth.uid()) OR auth.uid() IS NOT NULL);

CREATE POLICY "Insert own area"
  ON public.member_areas FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid() OR public.is_super_admin(auth.uid()));

CREATE POLICY "Update own area"
  ON public.member_areas FOR UPDATE TO authenticated
  USING (owner_id = auth.uid() OR public.is_super_admin(auth.uid()))
  WITH CHECK (owner_id = auth.uid() OR public.is_super_admin(auth.uid()));

CREATE POLICY "Delete own area"
  ON public.member_areas FOR DELETE TO authenticated
  USING (owner_id = auth.uid() OR public.is_super_admin(auth.uid()));

-- 8. Seed: super_admin para joaolucasps2001@gmail.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('34b60957-e37c-4667-a57e-7b02656cafdc', 'super_admin')
ON CONFLICT DO NOTHING;
