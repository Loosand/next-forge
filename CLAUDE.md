# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

next-forge is a production-grade Turborepo template for Next.js applications. It's a comprehensive SaaS starter kit providing authentication, payments, database, email, and more out of the box.

## Commands

```bash
# Development
pnpm dev              # Start all apps concurrently
pnpm build            # Build all packages and apps
pnpm test             # Run Vitest across monorepo

# Code Quality
pnpm check            # Lint and format check (ultracite/biome)
pnpm fix              # Auto-fix formatting issues

# Database
pnpm migrate          # Format schema, generate client, push to DB

# Other
pnpm analyze          # Bundle size analysis
pnpm clean            # Deep clean node_modules
```

Individual app development (from app directory):
```bash
pnpm dev              # Start single app
pnpm typecheck        # TypeScript check
```

## Architecture

### Monorepo Structure

```
apps/
├── app/       # Main application (port 3000) - shadcn/ui
├── web/       # Marketing site (port 3001) - Tailwind/TWBlocks
├── api/       # API server (port 3002) - webhooks, cron
├── docs/      # Documentation - Fumadocs
├── email/     # Email preview - React Email
└── storybook/ # Component development

packages/
├── design-system/   # shadcn/ui components
├── database/        # Drizzle ORM with Neon adapter
├── auth/            # Clerk authentication
├── payments/        # Stripe integration
├── analytics/       # Google Analytics + PostHog
├── observability/   # Sentry + logging
├── security/        # Arcjet + rate limiting
└── ...              # 20+ shared packages
```

### Environment Variable Pattern

Each package exports a `keys()` function with Zod-validated env vars:

```typescript
// packages/auth/keys.ts
export const keys = () => createEnv({
  server: { CLERK_SECRET_KEY: z.string().startsWith("sk_").optional() },
  client: { NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().startsWith("pk_").optional() },
  runtimeEnv: { /* ... */ },
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

## Key Conventions

- **Biome** for formatting and linting (not Prettier/ESLint)
- **Vitest** for testing
- **t3-oss/env-nextjs** for type-safe environment variables
- Route groups for auth: `(authenticated)/` and `(unauthenticated)/`
- Each package has `server-only` imports where needed to prevent client leakage
