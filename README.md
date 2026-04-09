# Math Dojo 🥋

A fun, serverless math practice web application for elementary school kids (grades 1–6).

## Features

- **Multi-user profiles** — create or select a ninja name + avatar, no sign-up required
- **Grades 1–6** — topics tailored per grade level
- **11 math topics** — addition, subtraction, multiplication, division, fractions, geometry, place value, time, money, word problems, patterns
- **3 difficulty levels** — auto-selected based on progress, or manually overridden
- **10-question sessions** — procedurally generated, no duplicates
- **Hint system** — up to 3 step-by-step hints per question
- **XP + levelling** — 200 XP per level, max level 30
- **20 achievement badges** — streaks, accuracy, speed, topic mastery, milestones
- **Bilingual** — English and Bahasa Indonesia, switchable at runtime
- **Responsive** — mobile (NumberPad + BottomNav), tablet, and desktop layouts
- **Serverless** — pure client-side static app, deploys to Cloudflare Pages
- **Persistent progress** — all data stored in browser localStorage, no backend

## Tech Stack

| Concern | Choice |
|---------|--------|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS v3 |
| Deployment | Cloudflare Pages |
| State | React Context + localStorage |
| i18n | Custom `useLocale` hook |

## Getting Started

```bash
npm install
npm run dev       # http://localhost:5173
```

## Build & Deploy

```bash
npm run build     # TypeScript check + Vite production build → dist/
npm run preview   # Serve dist/ locally at http://localhost:4173
npm run deploy    # Build + deploy to Cloudflare Pages
```

### Cloudflare Pages Setup (one-time)

```bash
npx wrangler pages project create math-dojo
npm run deploy
```

## Project Structure

```
src/
├── store/          # AppStore schema, localStorage helpers, StoreContext
├── i18n/           # English + Bahasa Indonesia translations + useLocale hook
├── curriculum/     # Grade topics, procedural problem generator, achievements
├── hooks/          # useSession (state machine)
└── components/
    ├── layout/     # AppShell, Header, BottomNav
    ├── ui/         # Button, Card, Modal, ProgressBar, StarRating, Badge, Confetti
    ├── screens/    # Welcome, Profile, Home, TopicSelect, Practice, Result, Achievements, Settings
    └── practice/   # QuestionCard, NumberPad, AnswerFeedback, SessionTimer
```

## Data Storage

All data is stored under a single `math-dojo` localStorage key. No server-side storage is used. Supports up to 6 user profiles, each with independent XP, streak, topic progress, and achievement history.
