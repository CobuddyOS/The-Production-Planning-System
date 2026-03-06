# COBUDDY OS Architecture Guide

This guide describes our project's **scalable, feature-based architecture** and naming conventions. Follow these rules when adding new components, logic, or pages.

## 1. Directory Structure

### `src/app/` (The Routing Layer)
- **Purpose**: Page routing and layouts using Next.js App Router.
- **Rules**: Keep these files thin. Use them only to import components and handle basic page layout.
- **Route Groups**: Use parenthetical grouping for logical routes without affecting the URL:
  - `(auth)/` — Authentication pages (login, signup)
  - `(dashboard)/` — Protected pages (debug, admin features)
- **Allowed files**: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts`

### `src/features/` (The Business Logic Layer)
- **Purpose**: The core of the application. Organized by functional domains.
- **Current domains**: `auth/`, `tenant/`, `admin/`
- **Structure within a feature**:
  - `types/` — TypeScript interfaces and type definitions
  - `hooks/` — Custom React hooks for that feature
  - `utils/` — Pure utility functions and helpers
  - `constants.ts` — Feature-specific constants
  - `index.ts` — Barrel export for clean imports
- **Import pattern**: `import { useSession } from '@/features/auth'`

### `src/components/` (The Component Library)
- **`ui/`**: Low-level, generic atoms (Buttons, Inputs, Modals). Often managed by `shadcn/ui`.
- **`shared/`**: Reusable components that are used across multiple features but aren't feature-specific (e.g., Layout headers, footers).
- Add these directories when components are needed; don't create empty placeholders.

### `src/lib/` (External Libraries)
- **Purpose**: Configuration and thin wrappers for external libraries (e.g., Supabase, Posthog, Resend).
- **Supabase clients**: Centralized in `src/lib/supabase/`
  - `client.ts` — Browser-side Supabase client
  - `server.ts` — Server-side Supabase client (SSR with cookies)

### `src/proxy.ts` (The Infrastructure Layer)
- **Purpose**: Critical logic for tenant detection, auth gating, and URL rewrites.
- **Location**: Must be at `src/proxy.ts` (Next.js 16+ convention, replaces the deprecated `middleware.ts`).
- **Exports**: `proxy()` function and `config` with matcher.

### `src/app/api/` (API Routes)
- **Purpose**: Server-side API handlers.
- **Rules**: Keep route handlers as thin controllers. Import logic from `features/`.
- **Current routes**:
  - `api/admin/ping/` — Protected admin endpoint
  - `api/debug/tenant/` — Tenant debugging endpoint

---

## 2. Naming Conventions

### Files & Folders
- **Folders/Non-React files**: `kebab-case` (e.g., `extract-slug.ts`, `use-session.ts`).
- **React Components**: `PascalCase` (e.g., `Button.tsx`, `SignupClient.tsx`).
- **React Hooks**: `camelCase` starting with `use` (e.g., `useSession`), files in `kebab-case` (e.g., `use-session.ts`).
- **Barrel exports**: Always use `index.ts` for clean imports.

### Code Styles
- **Interfaces**: Capitalize (e.g., `Tenant`, `PingResult`).
- **Exports**: Prefer **named exports** over default exports for better IDE autocomplete and refactoring support.
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `ADMIN_ALLOWED_ROLES`).

---

## 3. Import Rules

- **Features** import from `@/lib/` and `@/features/` — never from `@/app/`.
- **Pages** (`src/app/`) import from `@/features/`, `@/lib/`, and `@/components/`.
- **API routes** (`src/app/api/`) import from `@/features/` and `@/lib/`.
- **Never** create circular imports between features.

---

## 4. Deployment & Multi-tenancy
- **Local Development**: Use `subdomain.localhost:3000`. Update your hosts file (Windows: `C:\Windows\System32\drivers\etc\hosts`) to map `127.0.0.1 tenant-a.localhost`.
- **Production**: Vercel will handle custom domain mapping based on the `middleware.ts` logic.
