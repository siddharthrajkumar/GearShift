# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `pnpm dev` (uses Turbopack for faster builds)
- **Build**: `pnpm build` (uses Turbopack)
- **Production server**: `pnpm start`
- **Linting and formatting**: `biome check` and `biome format --write`
- **Package manager**: Uses `pnpm` (version 10.15.1+)

## Project Architecture

This is a Next.js 15.5.4 project using the App Router with TypeScript and React 19. Key architectural decisions:

### Tech Stack
- **Framework**: Next.js 15 with App Router (src/app directory structure)
- **Styling**: Tailwind CSS v4.1 with custom CSS variables for theming
- **Code quality**: Biome for linting and formatting (replaces ESLint/Prettier)
- **Fonts**: Geist Sans and Geist Mono via `next/font/google`
- **TypeScript**: Strict mode enabled with path aliases (`@/*` maps to `./src/*`)

### Project Structure
- Source files are in `src/app/` following Next.js App Router conventions
- Global styles in `src/app/globals.css` with CSS custom properties for theming
- Dark/light mode handled via CSS `prefers-color-scheme` media queries
- TypeScript path aliases configured for `@/*` imports

### Configuration Files
- **biome.json**: Configured for Next.js and React with recommended rules
- **next.config.ts**: Minimal configuration (ready for customization)
- **tsconfig.json**: Strict TypeScript with Next.js plugin and path aliases
- **postcss.config.mjs**: Configured for Tailwind CSS processing

### Development Notes
- Uses Turbopack for faster development and builds
- Biome handles both linting (`biome check`) and formatting (`biome format --write`)
- CSS uses modern features like `@theme inline` for Tailwind integration
- Font variables are properly configured for use throughout the application
- before running a dev server check if there is a running service on port 3000. if there is, then kill that process and restart