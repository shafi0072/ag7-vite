-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text,
  role text,
  preferences jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create container status enum type
DO $$ BEGIN
  CREATE TYPE container_status AS ENUM ('creating', 'running', 'stopped', 'error');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create containers table
CREATE TABLE IF NOT EXISTS public.containers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  container_id text NOT NULL DEFAULT '',
  container_name text NOT NULL UNIQUE,
  status container_status NOT NULL DEFAULT 'creating',
  port integer NOT NULL,
  subdomain text NOT NULL,
  kimi_api_key text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  last_started_at timestamptz
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_containers_user_id ON public.containers(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_containers_port ON public.containers(port);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.containers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can manage all users" ON public.users
  FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for containers table
CREATE POLICY "Users can view own containers" ON public.containers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all containers" ON public.containers
  FOR ALL USING (auth.role() = 'service_role');

-- Auto-create user profile on signup via trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
