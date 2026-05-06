
-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin', 'student');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- MEMBER ACCESS
CREATE TABLE public.member_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product TEXT NOT NULL DEFAULT 'infozap',
  order_id UUID REFERENCES public.orders(id),
  active BOOLEAN NOT NULL DEFAULT true,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product)
);
ALTER TABLE public.member_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own access" ON public.member_access FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all access" ON public.member_access FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage access" ON public.member_access FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.has_active_access(_user_id UUID, _product TEXT DEFAULT 'infozap')
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.member_access WHERE user_id = _user_id AND product = _product AND active = true)
$$;

-- MODULES
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT false,
  product TEXT NOT NULL DEFAULT 'infozap',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members view published modules" ON public.modules FOR SELECT
  USING (published = true AND public.has_active_access(auth.uid(), product));
CREATE POLICY "Admins manage modules" ON public.modules FOR ALL
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER modules_updated_at BEFORE UPDATE ON public.modules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- LESSONS
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  youtube_url TEXT,
  youtube_id TEXT,
  duration_seconds INTEGER,
  thumbnail_url TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_lessons_module ON public.lessons(module_id, position);

CREATE POLICY "Members view published lessons" ON public.lessons FOR SELECT
  USING (
    published = true
    AND EXISTS (SELECT 1 FROM public.modules m WHERE m.id = lessons.module_id AND m.published = true AND public.has_active_access(auth.uid(), m.product))
  );
CREATE POLICY "Admins manage lessons" ON public.lessons FOR ALL
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER lessons_updated_at BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- LESSON PROGRESS
CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  watched_seconds INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  last_watched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_progress_user ON public.lesson_progress(user_id, last_watched_at DESC);

CREATE POLICY "Users view own progress" ON public.lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own progress" ON public.lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own progress" ON public.lesson_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins view all progress" ON public.lesson_progress FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER progress_updated_at BEFORE UPDATE ON public.lesson_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- STORAGE
INSERT INTO storage.buckets (id, name, public) VALUES ('module-covers', 'module-covers', true);

CREATE POLICY "Public read module covers" ON storage.objects FOR SELECT USING (bucket_id = 'module-covers');
CREATE POLICY "Admins upload module covers" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'module-covers' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update module covers" ON storage.objects FOR UPDATE
  USING (bucket_id = 'module-covers' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete module covers" ON storage.objects FOR DELETE
  USING (bucket_id = 'module-covers' AND public.has_role(auth.uid(), 'admin'));

-- SEED 17 InfoZap modules (drafts)
INSERT INTO public.modules (title, position, published, product) VALUES
('Seja Bem Vindo', 1, false, 'infozap'),
('Mindset do InfoZap', 2, false, 'infozap'),
('Fundamentos do Pay After Delivery', 3, false, 'infozap'),
('Escolha de Nicho', 4, false, 'infozap'),
('Criação do Produto', 5, false, 'infozap'),
('Estrutura do WhatsApp', 6, false, 'infozap'),
('Copywriting para WhatsApp', 7, false, 'infozap'),
('Tráfego Pago do Zero', 8, false, 'infozap'),
('Campanhas no Meta Ads', 9, false, 'infozap'),
('Otimização e Escala', 10, false, 'infozap'),
('Atendimento e Vendas', 11, false, 'infozap'),
('Pagamento Após Entrega', 12, false, 'infozap'),
('Recuperação de Vendas', 13, false, 'infozap'),
('Análise de Métricas', 14, false, 'infozap'),
('Bônus: Funis Avançados', 15, false, 'infozap'),
('Bônus: Comunidade', 16, false, 'infozap'),
('Bônus: Atualizações', 17, false, 'infozap');
