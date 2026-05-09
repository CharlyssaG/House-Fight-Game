# The House Fight Game

AI-powered party game. One fighter, everyone picks a challenger, Claude runs the simulation.

## Deploy to Vercel (step by step)

### 1. Get an Anthropic API key
- Go to https://console.anthropic.com
- Create an account and go to API Keys
- Create a new key — copy it somewhere safe

### 2. Push this project to GitHub
```bash
cd house-fight-game
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/house-fight-game.git
git push -u origin main
```

### 3. Deploy on Vercel
- Go to https://vercel.com and sign in with GitHub
- Click "Add New Project"
- Import your `house-fight-game` repository
- Before deploying, click "Environment Variables" and add:
  - Name: `ANTHROPIC_API_KEY`
  - Value: your key from step 1
- Click Deploy

That's it. Vercel gives you a public URL you can share with anyone.

## Local development
```bash
npm install
# Edit .env.local and add your key:
# ANTHROPIC_API_KEY=your_key_here
npm run dev
# Open http://localhost:3000
```

## How it works
- `/app/page.js` — the full game frontend
- `/app/api/fight/route.js` — secure backend route that calls Claude to simulate fights
- `/app/api/random-fighter/route.js` — generates random fighters
- Your API key never touches the browser — it only lives in Vercel's environment variables
