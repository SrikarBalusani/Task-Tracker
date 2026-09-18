# Daily Progress Tracker

A personal daily task-tracking app to log daily study/work progress 
(DSA, OS, JS Project, German learning, GATE prep, etc.) with a 
read-only view for my brother to check my progress anytime.

🔗 **Live site:** [task-tracker-one-gamma-93.vercel.app](https://task-tracker-one-gamma-93.vercel.app/)

## Features
- Daily tasks reset automatically at midnight
- Mark tasks as Done/Not done with notes
- Add one-off tasks for a single day, or permanent recurring tasks
- Retire fully completed tasks into a "Hall of Fame"
- View past days' progress in the History page
- Edit Mode (PIN-protected, for me) and View Mode (open, for my brother)

## Tech Stack
- Next.js + Tailwind CSS
- Prisma ORM + Postgres (Neon)

## Getting Started
1. Clone the repo
2. Copy `.env.example` to `.env` and fill in your `DATABASE_URL` and `EDIT_PIN`
3. Run `npm install`
4. Run `npx prisma migrate dev`
5. Run `npx prisma db seed`
6. Run `npm run dev`
