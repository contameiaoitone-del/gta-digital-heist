
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'testecaio@gmail.com';

  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, email_change,
      email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      v_user_id, 'authenticated', 'authenticated',
      'testecaio@gmail.com',
      crypt('senha123', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Teste Caio"}'::jsonb,
      now(), now(), '', '', '', ''
    );
    INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', 'testecaio@gmail.com', 'email_verified', true),
      'email', now(), now(), now()
    );
  ELSE
    UPDATE auth.users
       SET encrypted_password = crypt('senha123', gen_salt('bf')),
           email_confirmed_at = COALESCE(email_confirmed_at, now()),
           updated_at = now()
     WHERE id = v_user_id;
  END IF;

  INSERT INTO public.profiles (id, full_name, email)
  VALUES (v_user_id, 'Teste Caio', 'testecaio@gmail.com')
  ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;

  IF NOT EXISTS (SELECT 1 FROM public.member_access WHERE user_id = v_user_id AND product = 'infozap') THEN
    INSERT INTO public.member_access (user_id, product, active)
    VALUES (v_user_id, 'infozap', true);
  ELSE
    UPDATE public.member_access SET active = true WHERE user_id = v_user_id AND product = 'infozap';
  END IF;
END $$;
