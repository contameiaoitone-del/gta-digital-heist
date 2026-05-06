
ALTER TABLE public.visitor_sessions
  ADD COLUMN IF NOT EXISTS ttclid text,
  ADD COLUMN IF NOT EXISTS ttp text,
  ADD COLUMN IF NOT EXISTS event_id_pageview_tt text,
  ADD COLUMN IF NOT EXISTS event_id_initiate_tt text,
  ADD COLUMN IF NOT EXISTS event_id_purchase_tt text;
