-- Create table to store RP Close purchase submissions
CREATE TABLE public.rp_close_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  instagram TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.rp_close_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public insert (form submissions without authentication)
CREATE POLICY "Anyone can submit form" 
ON public.rp_close_submissions 
FOR INSERT 
WITH CHECK (true);

-- Only allow reading through backend (no public select)
CREATE POLICY "No public read access" 
ON public.rp_close_submissions 
FOR SELECT 
USING (false);