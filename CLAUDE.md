# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

next-forge is a production-grade Turborepo template for Next.js applications. It's a comprehensive SaaS starter kit providing authentication, payments, database, email, and more out of the box.

For detailed documentation about this project, see the docs in `docs/content/docs/`.

## Commands

### Root-level Commands

```bash
# Development
pnpm dev              # Start all apps concurrently (excludes docs, cms, storybook)
pnpm build            # Build all packages and apps (runs tests first)
pnpm test             # Run Vitest across monorepo

# Code Quality
pnpm check            # Lint and format check (ultracite/biome)
pnpm fix              # Auto-fix formatting issues

# Database (shortcuts to packages/database commands)
pnpm db:generate      # Generate Drizzle client from schema
pnpm db:migrate       # Run migrations
pnpm db:push          # Push schema changes to database
pnpm db:studio        # Open Drizzle Studio

# Maintenance
pnpm analyze          # Bundle size analysis
pnpm clean            # Deep clean all node_modules
pnpm bump-deps        # Update all dependencies (except recharts)
pnpm bump-ui          # Update all shadcn/ui components
```

### Individual App Development

From within an app directory (e.g., `apps/app/`):
```bash
pnpm dev              # Start single app (uses dotenv to load ../../.env and .env)
pnpm build            # Build app
pnpm test             # Run app tests
pnpm typecheck        # TypeScript check
```

### Database Package Commands

From `packages/database/`:
```bash
pnpm generate         # Generate Drizzle client from schema.ts
pnpm migrate          # Run migrations
pnpm push             # Push schema to database (faster than migrate)
pnpm studio           # Open Drizzle Studio UI
```


## Architecture

### Monorepo Structure

```
apps/
├── app/       # Main application (port 3000) - Next.js App Router with shadcn/ui
│              # Includes both authenticated app pages and public marketing pages
├── api/       # API server (port 3002) - webhooks, cron jobs, health checks
├── docs/      # Documentation (port 3004) - Mintlify
├── email/     # Email preview - React Email
├── storybook/ # Component development
└── studio/    # Database studio

packages/
├── design-system/      # shadcn/ui components
├── database/           # Drizzle ORM with PostgreSQL/Neon
├── auth/               # Better Auth authentication
├── payments/           # Stripe integration with @stripe/agent-toolkit
├── analytics/          # Google Analytics + PostHog
├── observability/      # Sentry + BetterStack logging
├── security/           # Arcjet security + rate limiting
├── email/              # Resend email integration
├── webhooks/           # Svix webhook handling
├── collaboration/      # Liveblocks real-time features
├── notifications/      # Knock notifications
├── feature-flags/      # Vercel feature flags
├── cms/                # Basehub CMS
├── seo/                # SEO metadata utilities
├── storage/            # File storage
├── internationalization/ # i18n support
├── ai/                 # AI utilities
└── ...                 # Additional shared packages
```

### Environment Variable Pattern

Each package exports a `keys()` function with Zod-validated env vars:

```typescript
// packages/auth/keys.ts
export const keys = () => createEnv({
  server: { BETTER_AUTH_SECRET: z.string().min(16) },
  client: {},
  runtimeEnv: { BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET },
});
```

Apps compose these in their `env.ts`:

```typescript
// apps/app/env.ts
export const env = createEnv({
  extends: [auth(), database(), analytics(), /* ... */],
});
```

### Next.js Config Composition

Packages export `with*` wrapper functions that compose the config:

```typescript
// apps/app/next.config.ts
let nextConfig = withToolbar(withLogging(config));
if (env.VERCEL) nextConfig = withSentry(nextConfig);
if (env.ANALYZE === "true") nextConfig = withAnalyzer(nextConfig);
```

### Package References

All internal packages use `@repo/*` namespace with workspace protocol:
```json
"@repo/design-system": "workspace:*"
```