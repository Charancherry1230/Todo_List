# Modern Full-Stack To-Do Application

A production-ready full-stack To-Do Application with complete CRUD functionality, modern UI/UX, and a scalable Next.js App Router architecture.

## Features

- **Full CRUD Support**: Create, Read, Update, and Delete tasks.
- **Bulk Actions**: Delete multiple tasks at once.
- **Advanced Filtering & Sorting**: Filter by status, priority, category. Sort by due date, priority, title, and creation time.
- **Optimistic UI Updates**: Instant feedback on client actions without waiting for the server.
- **Responsive Dashboard**: Beautiful, professional UI built with Tailwind CSS and custom components.
- **Dark Mode**: Support for light, dark, and system themes.
- **Database**: Prisma ORM with SQLite (development) and PostgreSQL (production ready).

## Technology Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Lucide React
- **Backend & API**: Next.js Serverless Route Handlers
- **Database**: PostgreSQL (Prisma ORM)
- **Forms & Validation**: React Hook Form, Zod
- **Notifications**: Sonner

## Development Setup

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Database Configuration**:
   The development environment uses SQLite. For production, update `prisma/schema.prisma` to use `postgresql` and set `DATABASE_URL` in `.env`.
4. **Migrate the Database**: `npx prisma migrate dev`
5. **Run the App**: `npm run dev`
6. Open [http://localhost:3000](http://localhost:3000)

## Deployment Guide (Vercel + Hosted PostgreSQL)

### 1. Database Setup
We recommend using a managed PostgreSQL service like **Railway**, **Neon**, **Render**, or **Supabase**.
1. Create a PostgreSQL database on one of the platforms.
2. Copy the connection string URL.
3. In `prisma/schema.prisma`, change the provider from `"sqlite"` to `"postgresql"`.

### 2. Vercel Deployment (Frontend + API)
1. Push your code to a GitHub repository.
2. Import the project in Vercel.
3. In the Vercel **Environment Variables** settings, add:
   - `DATABASE_URL` = Your PostgreSQL connection string.
4. Vercel will automatically run `npm run build`. 
   Add a customized build script overriding default in Vercel inside package.json to generate Prisma Client:
   `"build": "prisma generate && prisma migrate deploy && next build"`
5. Click **Deploy**.

## Code Quality Standards
- Strict TypeScript enforcement (no implicit any)
- Server-side and client-side Zod validation
- Reusable UI primitives isolated in `src/components/ui/`
- Tailwind configuration utilizing CSS Variables for precise theming.
