# ToolsLiguns - Professional SaaS Platform

A modern SaaS platform built with Next.js 14/15, TypeScript, Tailwind CSS, and Shadcn UI.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (Slate theme)
- **Icons**: Lucide React
- **Database**: Supabase
- **Package Manager**: npm

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable components
│   ├── ui/          # Shadcn UI components
│   ├── layout/      # Layout components
│   └── features/    # Feature-specific components
├── lib/             # Utility functions and helpers
│   ├── utils.ts     # Class merging utilities
│   └── supabase/    # Supabase client configuration
├── types/           # TypeScript type definitions
└── actions/         # Server actions
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your Supabase credentials.

3. **Set up the database:**

Run the SQL schema in your Supabase project:
   - Go to your Supabase Dashboard → **SQL Editor**
   - Copy the contents of [supabase-schema.sql](./supabase-schema.sql)
   - Paste and run in the SQL Editor
   - See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed instructions

4. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Adding Shadcn UI Components

To add Shadcn UI components to your project:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
# ... add more components as needed
```

## 🎨 Theme

The project uses a dark-mode friendly Slate/Zinc color palette. Dark mode is enabled by default.

To toggle dark mode, update the `className` in `src/app/layout.tsx`:
- Dark mode: `<html lang="en" className="dark">`
- Light mode: `<html lang="en">`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## � Database Schema

The project includes a complete database schema for managing social media posts across multiple websites.

**Tables:**
- `websites` - Websites you're promoting
- `accounts` - Social media credentials and OAuth tokens
- `posts` - Content master (captions, images)
- `post_schedules` - Execution queue (up to 1 year scheduling)

**Features:**
- Row Level Security (RLS) for multi-tenancy
- Automated timestamp updates
- Foreign key cascades
- Helpful analytics views
- Optimized indexes for performance

**Documentation:**
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Quick start guide
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Detailed documentation
- [supabase-schema.sql](./supabase-schema.sql) - SQL script to run

## �🔗 Supabase Integration

Supabase clients are configured for both client-side and server-side operations:

- **Client-side**: `import { createClient } from '@/lib/supabase/client'`
- **Server-side**: `import { createClient } from '@/lib/supabase/server'`

Make sure to set your Supabase credentials in `.env.local`.

## 📄 License

Private - All rights reserved
