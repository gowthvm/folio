# Folio — Skill Tracker

A full-stack skill tracking web application with a newspaper aesthetic. Built with Next.js 14, Supabase, and Tailwind CSS.

![Folio Preview](https://via.placeholder.com/800x400?text=Folio+Preview)

## Features

- **Newspaper Aesthetic**: Warm off-white backgrounds, serif fonts (Playfair Display), and thin column borders
- **Wikipedia-Style Dark Mode**: Clean white text on charcoal for nighttime reading
- **Skill Tracking**: Create skills, set milestones, log practice sessions
- **XP System**: Earn XP by completing milestones based on their weight
- **Streak Tracking**: Keep your practice streak alive
- **Typewriter Animations**: Page headings appear with a typewriter effect
- **Google OAuth**: Sign in with Google or email/password

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth with Google OAuth
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Deployment**: Vercel-ready

## Getting Started

### 1. Clone and Install

```bash
git clone <your-repo>
cd folio
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Run the database migrations in `supabase/migrations/`
4. Enable Google Auth provider in Authentication > Providers
5. Copy `.env.local.example` to `.env.local` and fill in your values

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Database Schema

### Skills
- Track learning objectives with categories (music, fitness, learning, creative, other)
- XP tracking and streak counts
- Optional target dates and emoji covers

### Milestones
- Weight-based progress system (must sum to 100% per skill)
- Status tracking: not_started, in_progress, completed
- Lock/unlock dependencies between milestones
- Estimated time and XP rewards

### Sessions
- Log practice sessions linked to milestones
- Track mood (great, okay, struggled)
- Duration tracking and session notes

## Row Level Security

All tables have RLS policies ensuring users can only access their own data:
- Skills: user_id must match auth.uid()
- Milestones: Must belong to user's skill
- Sessions: user_id must match auth.uid()

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Deployment

### Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

## License

MIT
