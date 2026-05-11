
ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS vturb_optimization_code text;
