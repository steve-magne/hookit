-- Schéma Supabase pour Hookit (POC v0.1)
-- À exécuter dans l'éditeur SQL Supabase.

-- Hooks du registre (miroir de registry/registry.json, optionnel en POC)
create table if not exists public.hooks (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null,
  provider text[] not null,
  hook_type text not null,
  trigger text,
  description text,
  use_cases text[],
  implementation jsonb,
  tags text[],
  votes integer default 0,
  created_at timestamptz default now()
);

-- Dépôts soumis par la communauté
create table if not exists public.community_submissions (
  id uuid primary key default gen_random_uuid(),
  repo_url text not null,
  submitted_by uuid references auth.users,
  issue_url text,
  status text default 'pending',
  created_at timestamptz default now()
);

-- Hooks détectés dans les dépôts soumis
create table if not exists public.community_examples (
  id uuid primary key default gen_random_uuid(),
  hook_id uuid references public.hooks(id),
  submission_id uuid references public.community_submissions(id),
  repo_url text,
  file_path text,
  code_snippet text,
  created_at timestamptz default now()
);

-- Row Level Security
alter table public.hooks enable row level security;
alter table public.community_submissions enable row level security;
alter table public.community_examples enable row level security;

-- Lecture publique du registre
create policy "hooks lisibles par tous"
  on public.hooks for select using (true);

create policy "examples lisibles par tous"
  on public.community_examples for select using (true);

-- Soumission : tout utilisateur authentifié peut créer, et voir les siennes
create policy "créer une soumission (authentifié)"
  on public.community_submissions for insert
  with check (auth.uid() = submitted_by);

create policy "voir ses soumissions"
  on public.community_submissions for select
  using (auth.uid() = submitted_by);
