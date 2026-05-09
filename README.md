# The House Fight Game v2

Cross-nation party game with accounts, rooms, and global leaderboard.

## Setup order

### 1. Supabase
1. Go to https://supabase.com and create a free project
2. Go to SQL Editor and run the entire contents of `supabase/schema.sql`
3. Go to Authentication > Providers > Google and enable Google OAuth
   - You'll need a Google Cloud project with OAuth credentials
   - Authorized redirect URI: `https://your-project-ref.supabase.co/auth/v1/callback`
4. Copy your project URL and keys from Settings > API

### 2. Environment variables
Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ANTHROPIC_API_KEY=your_anthropic_key
NEXT_PUBLIC_SITE_URL=https://your-vercel-url.vercel.app
```

### 3. Vercel deployment
1. Push to GitHub
2. Import project in Vercel
3. Add ALL environment variables from above in Vercel settings
4. Deploy

### 4. Supabase auth callback
In Supabase > Authentication > URL Configuration:
- Site URL: your Vercel URL
- Redirect URLs: your Vercel URL + `/**`

## How to play
1. Sign in with Google
2. Create a room → set anchor fighter → share the 6-character code
3. Everyone joins on their own phone at your Vercel URL
4. Each player submits their challenger
5. Host hits Simulate — AI runs all fights at once
6. Results show on everyone's screen via realtime
7. Stats save to each player's profile automatically
8. Start new rounds, or check the global leaderboard

## Local dev
```bash
npm install
npm run dev
```
