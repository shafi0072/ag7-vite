-- Per-container token for the OpenClaw control UI, so the shared LLM API key
-- is no longer used as the gateway token or sent to the browser.
alter table public.containers add column if not exists gateway_token text;
