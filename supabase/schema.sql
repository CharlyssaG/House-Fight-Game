-- Run this in Supabase SQL Editor

create extension if not exists "uuid-ossp";

create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  display_name text not null,
  avatar_color text default '#e63329',
  total_wins int default 0,
  total_losses int default 0,
  total_rounds int default 0,
  biggest_upset_pct int default 0,
  biggest_upset_fighter text default '',
  biggest_upset_anchor text default '',
  created_at timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_color)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1), 'Fighter'),
    '#e63329'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table public.rooms (
  id uuid default uuid_generate_v4() primary key,
  code text unique not null,
  host_id uuid references public.profiles(id) on delete cascade not null,
  anchor_name text not null default '',
  anchor_desc text default '',
  is_public boolean default true,
  status text default 'submitting',
  current_round int default 1,
  created_at timestamptz default now()
);

create table public.room_players (
  id uuid default uuid_generate_v4() primary key,
  room_id uuid references public.rooms(id) on delete cascade not null,
  player_id uuid references public.profiles(id) on delete cascade not null,
  joined_at timestamptz default now(),
  unique(room_id, player_id)
);

create table public.rounds (
  id uuid default uuid_generate_v4() primary key,
  room_id uuid references public.rooms(id) on delete cascade not null,
  round_number int not null,
  anchor_name text not null,
  anchor_desc text default '',
  status text default 'submitting',
  created_at timestamptz default now()
);

create table public.submissions (
  id uuid default uuid_generate_v4() primary key,
  round_id uuid references public.rounds(id) on delete cascade not null,
  player_id uuid references public.profiles(id) on delete cascade not null,
  challenger_name text not null,
  challenger_desc text default '',
  submitted_at timestamptz default now(),
  unique(round_id, player_id)
);

create table public.fight_results (
  id uuid default uuid_generate_v4() primary key,
  round_id uuid references public.rounds(id) on delete cascade not null,
  submission_id uuid references public.submissions(id) on delete cascade not null,
  player_id uuid references public.profiles(id) not null,
  anchor_name text not null,
  challenger_name text not null,
  winner text not null,
  challenger_win_pct int not null,
  stats jsonb default '[]',
  verdict text default '',
  quip text default '',
  is_upset boolean default false,
  created_at timestamptz default now()
);

create or replace view public.leaderboard as
select
  p.id, p.display_name, p.avatar_color,
  p.total_wins, p.total_losses, p.total_rounds,
  case when p.total_rounds > 0
    then round((p.total_wins::numeric / p.total_rounds) * 100, 1)
    else 0 end as win_rate,
  p.biggest_upset_pct, p.biggest_upset_fighter, p.biggest_upset_anchor,
  p.created_at
from public.profiles p
where p.total_rounds > 0
order by p.total_wins desc;

alter table public.profiles enable row level security;
alter table public.rooms enable row level security;
alter table public.room_players enable row level security;
alter table public.rounds enable row level security;
alter table public.submissions enable row level security;
alter table public.fight_results enable row level security;

create policy "profiles_select" on public.profiles for select using (true);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);
create policy "rooms_select" on public.rooms for select using (is_public = true or host_id = auth.uid());
create policy "rooms_insert" on public.rooms for insert with check (auth.uid() = host_id);
create policy "rooms_update" on public.rooms for update using (auth.uid() = host_id);
create policy "room_players_select" on public.room_players for select using (true);
create policy "room_players_insert" on public.room_players for insert with check (auth.uid() = player_id);
create policy "rounds_select" on public.rounds for select using (true);
create policy "rounds_insert" on public.rounds for insert with check (exists (select 1 from public.rooms where id = room_id and host_id = auth.uid()));
create policy "rounds_update" on public.rounds for update using (exists (select 1 from public.rooms where id = room_id and host_id = auth.uid()));
create policy "submissions_select" on public.submissions for select using (true);
create policy "submissions_insert" on public.submissions for insert with check (auth.uid() = player_id);
create policy "fight_results_select" on public.fight_results for select using (true);
create policy "fight_results_insert" on public.fight_results for insert with check (true);

alter publication supabase_realtime add table public.rooms;
alter publication supabase_realtime add table public.room_players;
alter publication supabase_realtime add table public.submissions;
alter publication supabase_realtime add table public.fight_results;
