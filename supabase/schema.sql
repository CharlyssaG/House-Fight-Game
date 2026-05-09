-- =============================================
-- THE HOUSE FIGHT GAME — SUPABASE SCHEMA
-- Run this entire file in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- PROFILES (linked to Supabase auth.users)
-- =============================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  display_name text not null,
  avatar_color text default '#e63329',
  total_wins integer default 0,
  total_losses integer default 0,
  total_rounds integer default 0,
  biggest_upset_pct integer default 0,
  biggest_upset_fighter text default '',
  biggest_upset_anchor text default '',
  favorite_pick text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_color)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1), 'Fighter'),
    '#e63329'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================
-- ROOMS
-- =============================================
create table public.rooms (
  id uuid default uuid_generate_v4() primary key,
  code text unique not null,
  host_id uuid references public.profiles(id) on delete cascade not null,
  anchor_name text not null default '',
  anchor_desc text default '',
  is_public boolean default true,
  status text default 'waiting', -- waiting | submitting | simulating | results | complete
  current_round integer default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- ROOM PLAYERS
-- =============================================
create table public.room_players (
  id uuid default uuid_generate_v4() primary key,
  room_id uuid references public.rooms(id) on delete cascade not null,
  player_id uuid references public.profiles(id) on delete cascade not null,
  joined_at timestamptz default now(),
  unique(room_id, player_id)
);

-- =============================================
-- ROUNDS
-- =============================================
create table public.rounds (
  id uuid default uuid_generate_v4() primary key,
  room_id uuid references public.rooms(id) on delete cascade not null,
  round_number integer not null,
  anchor_name text not null,
  anchor_desc text default '',
  status text default 'submitting', -- submitting | simulating | complete
  created_at timestamptz default now()
);

-- =============================================
-- CHALLENGER SUBMISSIONS
-- =============================================
create table public.submissions (
  id uuid default uuid_generate_v4() primary key,
  round_id uuid references public.rounds(id) on delete cascade not null,
  player_id uuid references public.profiles(id) on delete cascade not null,
  challenger_name text not null,
  challenger_desc text default '',
  submitted_at timestamptz default now(),
  unique(round_id, player_id)
);

-- =============================================
-- FIGHT RESULTS
-- =============================================
create table public.fight_results (
  id uuid default uuid_generate_v4() primary key,
  round_id uuid references public.rounds(id) on delete cascade not null,
  submission_id uuid references public.submissions(id) on delete cascade not null,
  player_id uuid references public.profiles(id) not null,
  anchor_name text not null,
  challenger_name text not null,
  winner text not null, -- 'anchor' | 'challenger'
  challenger_win_pct integer not null,
  stats jsonb default '[]',
  verdict text default '',
  quip text default '',
  is_upset boolean default false,
  created_at timestamptz default now()
);

-- =============================================
-- LEADERBOARD VIEW
-- =============================================
create or replace view public.leaderboard as
select
  p.id,
  p.display_name,
  p.avatar_color,
  p.total_wins,
  p.total_losses,
  p.total_rounds,
  case when p.total_rounds > 0 
    then round((p.total_wins::numeric / p.total_rounds) * 100, 1)
    else 0 
  end as win_rate,
  p.biggest_upset_pct,
  p.biggest_upset_fighter,
  p.biggest_upset_anchor,
  p.favorite_pick,
  p.created_at
from public.profiles p
where p.total_rounds > 0
order by p.total_wins desc, win_rate desc;

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
alter table public.profiles enable row level security;
alter table public.rooms enable row level security;
alter table public.room_players enable row level security;
alter table public.rounds enable row level security;
alter table public.submissions enable row level security;
alter table public.fight_results enable row level security;

-- Profiles: anyone can read, only owner can update
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Rooms: public rooms visible to all, private only to members
create policy "Public rooms visible to all" on public.rooms for select using (is_public = true or host_id = auth.uid());
create policy "Authenticated users can create rooms" on public.rooms for insert with check (auth.uid() = host_id);
create policy "Host can update room" on public.rooms for update using (auth.uid() = host_id);

-- Room players: visible to room members
create policy "Room players visible to members" on public.room_players for select using (true);
create policy "Players can join rooms" on public.room_players for insert with check (auth.uid() = player_id);

-- Rounds: visible to everyone
create policy "Rounds visible to everyone" on public.rounds for select using (true);
create policy "Host can create rounds" on public.rounds for insert with check (
  exists (select 1 from public.rooms where id = room_id and host_id = auth.uid())
);
create policy "Host can update rounds" on public.rounds for update using (
  exists (select 1 from public.rooms where id = room_id and host_id = auth.uid())
);

-- Submissions: visible to everyone, only owner can insert
create policy "Submissions visible to everyone" on public.submissions for select using (true);
create policy "Players can submit challengers" on public.submissions for insert with check (auth.uid() = player_id);

-- Fight results: visible to everyone
create policy "Fight results visible to everyone" on public.fight_results for select using (true);
create policy "Service role can insert results" on public.fight_results for insert with check (true);

-- =============================================
-- REALTIME (enable for live updates)
-- =============================================
alter publication supabase_realtime add table public.rooms;
alter publication supabase_realtime add table public.room_players;
alter publication supabase_realtime add table public.submissions;
alter publication supabase_realtime add table public.fight_results;

-- =============================================
-- HELPER FUNCTION: Generate room code
-- =============================================
create or replace function generate_room_code()
returns text as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code text := '';
  i int;
begin
  for i in 1..6 loop
    code := code || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  end loop;
  return code;
end;
$$ language plpgsql;
