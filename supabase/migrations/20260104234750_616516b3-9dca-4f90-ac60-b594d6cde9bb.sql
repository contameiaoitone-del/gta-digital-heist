-- Create updated_at function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create visitor_sessions table for SCK tracking
CREATE TABLE public.visitor_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sck text UNIQUE NOT NULL,
  fbp text,
  fbc text,
  ip_address text,
  user_agent text,
  page_location text,
  city text,
  state text,
  country text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.visitor_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public insert (no auth required for tracking)
CREATE POLICY "Allow public insert" ON public.visitor_sessions
FOR INSERT WITH CHECK (true);

-- Policy: Allow public update on own sck
CREATE POLICY "Allow public update" ON public.visitor_sessions
FOR UPDATE USING (true);

-- Create index for fast sck lookup
CREATE INDEX idx_visitor_sessions_sck ON public.visitor_sessions(sck);

-- Create updated_at trigger
CREATE TRIGGER update_visitor_sessions_updated_at
BEFORE UPDATE ON public.visitor_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();