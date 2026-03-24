-- What You Missed Newsletter — Supabase Schema
-- Run this in your Supabase SQL editor to create the required tables.

create table if not exists topics (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  summary     text,
  source_url  text,
  source_name text,
  status      text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at  timestamptz default now()
);

create table if not exists newsletters (
  id           uuid primary key default gen_random_uuid(),
  subject      text,
  content_html text,
  content_text text,
  status       text default 'draft' check (status in ('draft', 'sent')),
  slug         text unique,
  sent_at      timestamptz,
  created_at   timestamptz default now()
);

create table if not exists newsletter_topics (
  newsletter_id uuid references newsletters(id) on delete cascade,
  topic_id      uuid references topics(id) on delete cascade,
  primary key (newsletter_id, topic_id)
);

-- Indexes for common queries
create index if not exists topics_status_idx on topics(status);
create index if not exists topics_created_at_idx on topics(created_at desc);
create index if not exists newsletters_status_idx on newsletters(status);
create index if not exists newsletters_sent_at_idx on newsletters(sent_at desc);
create index if not exists newsletters_slug_idx on newsletters(slug);
