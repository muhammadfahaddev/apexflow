# ADR-001: Turborepo Monorepo Architecture

**Status:** Accepted  
**Date:** 2026-10-26

---

## Context

ApexFlow needs to support:
1. A web app (Next.js) for desktop users
2. A mobile app (Expo/React Native) for Android/iOS
3. Shared business logic (priority calc, scheduler algorithm)
4. Shared TypeScript types (Task, Event, Memory, etc.)
5. Multiple AI provider implementations (BYOAI)
6. A plugin SDK for community integrations

The key challenge: web and mobile apps need to share code without duplicating it.

## Decision

Use **Turborepo** as the monorepo build system with the following structure:

```
apps/
  web/      → Next.js 14
  mobile/   → Expo (React Native)
packages/
  types/        → Shared TypeScript interfaces
  ai-provider/  → BYOAI abstraction
  plugin-sdk/   → Community integration SDK
  utils/        → Business logic (scheduler, priority)
  constants/    → Enums and constants
```

## Rationale

**Why Turborepo over alternatives (Nx, Lerna)?**
- First-class pnpm workspace support
- Excellent remote caching for CI
- Simple configuration (`turbo.json`)
- Strong Next.js integration (same team as Vercel)

**Why not separate repos?**
- Would require npm publishing for every shared type change
- Developer experience significantly worse
- Type safety across app boundary harder to maintain

**Benefits for contributors:**
- A contributor working on Gmail integration only needs to touch `apps/web/lib/google/gmail.ts`
- A contributor adding a new AI provider only touches `packages/ai-provider/`
- A contributor building a community integration only touches `integrations/community/their-plugin/`
- No need to understand the full codebase

## Consequences

- **Positive:** Single `pnpm install` sets up everything
- **Positive:** Type changes instantly visible across apps
- **Positive:** CI builds only what changed (Turborepo caching)
- **Negative:** Slightly more complex initial setup than a single app
- **Negative:** Contributors need pnpm (not npm/yarn)
