# COBUDDY OS Architecture Guide

This guide describes our project's **scalable, feature-based architecture** and naming conventions. Follow these rules when adding new components, logic, or pages.

## 1. Directory Structure

### `src/app/` (The Routing Layer)
- **Purpose**: Page routing and layouts using Next.js App Router.
- **Rules**: Keep these files thin. Use them only to import components and handle basic page layout.
- **Naming**: Use parenthetical grouping for logical routes without affecting the URL (e.g., `(auth)`, `(dashboard)`).

### `src/features/` (The Business Logic Layer)
- **Purpose**: The core of the application. Organized by functional domains (e.g., `tenant`, `auth`, `user`).
- **Structure within a feature**:
  - `components/`: UI specific to that feature.
  - `hooks/`: Custom React hooks for that feature.
  - `services/`: API calls or specialized business logic.
  - `types/`: Related TypeScript interfaces.

### `src/components/` (The Component Library)
- **`ui/`**: Low-level, generic atoms (Buttons, Inputs, Modals). Often managed by `shadcn/ui`.
- **`shared/`**: Reusable components that are used across multiple features but aren't feature-specific (e.g., Layout headers, footers).

### `src/lib/` (External Libraries)
- **Purpose**: Configuration and thin wrappers for external libraries (e.g., Supabase, Posthog, Resend).

### `src/services/` (Global Data Layer)
- **Purpose**: High-level data services that are shared across the whole application or aren't tied to a specific feature.

### `src/proxy.ts` (The Infrastructure Layer)
- **Purpose**: Critical logic for tenant detection, auth gating, and URL rewrites. (Replaces the deprecated `middleware.ts` convention).

---

## 2. Naming Conventions

### Files & Folders
- **Folders/Non-React files**: `kebab-case` (e.g., `tenant-service.ts`, `auth-gate/`).
- **React Components**: `PascalCase` (e.g., `Button.tsx`, `LoginForm.tsx`).
- **React Hooks**: `camelCase` starting with `use` (e.g., `useTenant.ts`).

### Code Styles
- **Interfaces**: Start with `I` (Optional, as per preference) or just capitalize.
- **Exports**: Prefer **named exports** over default exports for better IDE autocomplete and refactoring support.

---

## 3. Deployment & Multi-tenancy
- **Local Development**: Use `subdomain.localhost:3000`. Update your hosts file (Windows: `C:\Windows\System32\drivers\etc\hosts`) to map `127.0.0.1 tenant-a.localhost`.
- **Production**: Vercel will handle custom domain mapping based on our `middleware.ts` logic.
