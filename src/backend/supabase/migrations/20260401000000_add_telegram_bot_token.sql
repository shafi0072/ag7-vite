-- Add telegram_bot_token column to containers table
ALTER TABLE public.containers
  ADD COLUMN IF NOT EXISTS telegram_bot_token text DEFAULT NULL;
