# COBUDDY OS: Database Design (Milestone 1)

This document outlines the core table structures and Row-Level Security (RLS) rules for the Milestone 1 Foundation Proof.

## 1. Core Tables

### `tenants`
Stores tenant-specific information.

| Column      | Type      | Notes                               |
|-------------|-----------|-------------------------------------|
| `id`        | uuid      | Primary Key                         |
| `slug`      | text      | Unique slug (e.g., 'tenant-a')     |
| `status`    | text      | 'active', 'suspended', 'deleted'   |
| `created_at`| timestamp | Default: `now()`                   |

### `profiles`
Links users to tenants and defines their roles.

| Column      | Type      | Notes                               |
|-------------|-----------|-------------------------------------|
| `id`        | uuid      | Primary Key                         |
| `user_id`   | uuid      | Reference to `auth.users(id)`       |
| `tenant_id` | uuid      | Reference to `tenants(id)`          |
| `role`      | text      | 'admin', 'editor', 'viewer'         |
| `created_at`| timestamp | Default: `now()`                   |

## 2. Row Level Security (RLS)

### `tenants` Table Rules
- **View**: Users can view only the tenant they belong to.
- **Edit**: Only Super Admins (Global) can modify tenants.

```sql
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only view their own tenant"
ON tenants FOR SELECT
USING (id = (SELECT tenant_id FROM profiles WHERE user_id = auth.uid()));
```

### `profiles` Table Rules
- **View**: Users can view their own profile and other profiles in the same tenant.
- **Edit**: Only admins in that tenant can edit profiles within their tenant.

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only view profiles in their own tenant"
ON profiles FOR SELECT
USING (tenant_id = (SELECT tenant_id FROM profiles WHERE user_id = auth.uid()));
```

## 3. Implementation Flow
1. **Sign Up**: Create entry in `auth.users`.
2. **Post-Join**: Create or join a `tenant` and create a `profile` entry linking the two.
3. **Middleware**: Identifies `tenant_slug` from host and provides it to the app.
4. **API**: Checks `profiles` table to ensure `auth.uid()` belongs to the current `tenant_id`.
