create extension if not exists "pgcrypto";

create table if not exists public.scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null,
  category text not null,
  item_title text not null,
  asking_price numeric null,
  location text null,
  listing_description text null,
  seller_messages text null,
  notes text null,
  overall_risk_score integer not null,
  verdict text not null,
  recommendation text not null,
  ai_report jsonb not null,
  created_at timestamp with time zone not null default now()
);

create table if not exists public.scan_images (
  id uuid primary key default gen_random_uuid(),
  scan_id uuid not null references public.scans(id) on delete cascade,
  image_url text not null,
  created_at timestamp with time zone not null default now()
);

create index if not exists scans_created_at_idx on public.scans(created_at desc);
create index if not exists scan_images_scan_id_idx on public.scan_images(scan_id);

-- Enable after auth is implemented and user_id is populated.
-- alter table public.scans enable row level security;
-- alter table public.scan_images enable row level security;
