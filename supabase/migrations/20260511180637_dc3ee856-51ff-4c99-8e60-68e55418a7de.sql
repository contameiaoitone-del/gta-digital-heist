-- Master implies all other roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND (role = _role OR role = 'master'::app_role)
  )
$$;

-- Seed initial master
INSERT INTO public.user_roles (user_id, role)
SELECT '34b60957-e37c-4667-a57e-7b02656cafdc'::uuid, 'master'::app_role
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles
  WHERE user_id = '34b60957-e37c-4667-a57e-7b02656cafdc'::uuid
    AND role = 'master'::app_role
);