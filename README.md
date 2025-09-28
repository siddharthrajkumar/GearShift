# GearShift

A modern web application built with Next.js 15, featuring authentication, database integration, and a beautiful UI.

## 🚀 Features

- **Authentication**: Complete authentication system with Better Auth
  - Email/password authentication
  - Google OAuth2 integration
  - Session management
- **Database**: PostgreSQL with Drizzle ORM
- **UI Components**: shadcn/ui components with Tailwind CSS v4
- **Form Handling**: React Hook Form with Zod validation
- **Modern Stack**: Next.js 15 with App Router and Turbopack

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Authentication**: Better Auth with Google OAuth2
- **Database**: PostgreSQL with Drizzle ORM
- **Forms**: React Hook Form + Zod validation
- **Build Tools**: Turbopack, Biome (ESLint + Prettier alternative)

## 📋 Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL database

## ⚡ Quick Start

1. **Clone and install dependencies**

   ```bash
   git clone <your-repo>
   cd GearShift
   pnpm install
   ```

2. **Set up environment variables**

   Copy `.env.local` and update the values:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/gearshift"
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"
   BETTER_AUTH_SECRET="your_better_auth_secret_key_here"
   BETTER_AUTH_URL="http://localhost:3000"
   ```

3. **Set up the database**

   ```bash
   # Generate database schema
   pnpm db:generate

   # Run migrations
   pnpm db:migrate
   ```

4. **Start the development server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🔧 Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run Biome linting
- `pnpm format` - Format code with Biome
- `pnpm db:generate` - Generate Drizzle schema
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Drizzle Studio

## 🎨 Project Structure

```text
src/
├── app/                    # Next.js App Router
│   ├── api/auth/          # Authentication API routes
│   ├── dashboard/         # Dashboard page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/
│   ├── auth/              # Authentication components
│   └── ui/                # shadcn/ui components
└── lib/
    ├── auth.ts            # Better Auth configuration
    ├── auth-client.ts     # Client-side auth utilities
    ├── db/                # Database configuration
    │   ├── index.ts       # Database connection
    │   └── schema.ts      # Drizzle schema
    └── utils.ts           # Utility functions
```

## 🔐 Authentication Setup

1. **Google OAuth2**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth2 credentials
   - Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

2. **Better Auth Secret**
   - Generate a secure random string for `BETTER_AUTH_SECRET`
   - Use: `openssl rand -base64 32`

## 🗄️ Database Schema

The application includes:

- `users` - User accounts
- `accounts` - OAuth provider accounts
- `sessions` - User sessions

## 🎯 Getting Started with Development

1. The homepage features a beautiful login form inspired by Arcana design
2. Authentication is handled by Better Auth with both email/password and Google OAuth
3. Forms use React Hook Form with Zod validation
4. UI components are built with shadcn/ui and Tailwind CSS v4
5. Database operations use Drizzle ORM with PostgreSQL

## 📝 Notes

- This project uses Biome instead of ESLint/Prettier for faster linting and formatting
- Tailwind CSS v4 is used for modern styling capabilities
- Turbopack is enabled for faster development builds
- The project is configured for TypeScript strict mode

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `pnpm lint` and `pnpm format`
5. Submit a pull request
