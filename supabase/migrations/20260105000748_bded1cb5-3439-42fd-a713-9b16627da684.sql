-- Add UNIQUE constraint to sck column for upsert to work
ALTER TABLE visitor_sessions 
ADD CONSTRAINT visitor_sessions_sck_unique UNIQUE (sck);