# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `pnpm dev` (uses Turbopack for faster builds)
- **Build**: `pnpm build` (uses Turbopack)
- **Production server**: `pnpm start`
- **Linting**: `pnpm lint` or `biome check`
- **Linting with fixes**: `pnpm lint:fix` or `biome check --write`
- **Formatting**: `pnpm format` or `biome format --write`
- **Package manager**: Uses `pnpm` (version 10.15.1+)

### Database Commands

- **Push schema**: `pnpm db:push` (push schema changes to database)
- **Database studio**: `pnpm db:studio` (open Drizzle Studio for database management)

## Project Architecture

GearShift is a motorcycle garage management platform built with Next.js 15.5.4, featuring complete authentication, database integration, and modern UI components. This is a full-stack application designed to digitize motorcycle garage operations.

### Tech Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **Authentication**: Better Auth with Google OAuth2 and email/password support
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS v4.1 with shadcn/ui components
- **Forms**: React Hook Form with Zod validation
- **Code quality**: Biome (replaces ESLint/Prettier)
- **Charts**: Recharts for data visualization
- **UI Library**: Radix UI primitives with custom styling

### Authentication Architecture

- **Better Auth**: Handles both OAuth (Google) and email/password authentication
- **Session Management**: Server-side sessions with PostgreSQL storage
- **Middleware Protection**: `src/middleware.ts` provides route-level authentication
- **Client Hooks**: `useSession` from `@/lib/auth-client` for client-side session access
- **Dual Protection**: Both server middleware and client-side redirects for security

### Database Schema (Drizzle ORM)

- **users**: User accounts with email verification
- **accounts**: OAuth provider account linking
- **sessions**: Session management with IP and user agent tracking
- **verification**: Email verification tokens
- **Configuration**: `drizzle.config.ts` uses `.env.local` for DATABASE_URL

### Project Structure

- **src/app/**: Next.js App Router pages and API routes
  - `/api/auth/[...all]/`: Better Auth API handler
  - `/dashboard/`: Protected dashboard area with sidebar navigation
  - `page.tsx`: Login/homepage with authentication redirect logic
  - `middleware.ts`: Route protection and authentication redirects
- **src/components/**: Reusable UI components
  - `auth/`: Authentication-related components (LoginForm)
  - `ui/`: shadcn/ui components (buttons, forms, sidebar, charts, etc.)
- **src/lib/**: Core utilities and configurations
  - `auth.ts`: Better Auth server configuration
  - `auth-client.ts`: Client-side authentication utilities
  - `db/`: Database connection and schema definitions

### Authentication Flow

1. **Unauthenticated users**: Redirected to `/` (login page) by middleware
2. **Login page**: Handles both Google OAuth and email/password authentication
3. **Authenticated users**: Automatically redirected to `/dashboard`
4. **Protected routes**: All `/dashboard/*` routes require authentication
5. **Session validation**: Both server (middleware) and client-side checking

### Configuration Files

- **biome.json**: Linting and formatting with Next.js/React domains enabled
- **drizzle.config.ts**: Database schema management and migrations
- **next.config.ts**: Minimal Next.js configuration
- **tailwind.config.ts**: Tailwind CSS v4 configuration
- **tsconfig.json**: TypeScript strict mode with `@/*` path aliases

### Environment Variables Required

```env
DATABASE_URL="postgresql://..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
BETTER_AUTH_SECRET="..." # Generate with: openssl rand -base64 32
BETTER_AUTH_URL="http://localhost:3000"
```

### Development Notes

- Uses Turbopack for faster builds and development
- Port 3000 conflicts: Check and kill existing processes before starting dev server
- Biome handles both linting and formatting (no ESLint/Prettier)
- Authentication middleware automatically handles route protection
- Database migrations managed through Drizzle Kit
- use react-query for any client side queries and mutation