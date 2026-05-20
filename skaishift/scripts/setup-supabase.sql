-- Run this once in your Supabase SQL editor
-- Creates the table that stores all daily articles for weekly brief generation

create table if not exists skaishift_articles (
  id              text primary key,       -- e.g. "a1", unique per day
  published_date  date not null,          -- "2025-05-19"
  cat             text,
  headline        text,
  body            text,
  build           text,
  img             text,
  source          text,
  significance    integer default 5,
  feat            boolean default false,
  time            text,
  created_at      timestamptz default now()
);

-- Index for fast weekly queries
create index if not exists idx_skaishift_date on skaishift_articles(published_date desc);

-- Enable RLS (restrict direct access)
alter table skaishift_articles enable row level security;

-- Allow service role (used by GitHub Actions) to do everything
create policy "service role full access"
  on skaishift_articles
  using (true)
  with check (true);
