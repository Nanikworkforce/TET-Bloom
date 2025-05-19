# Authentication and Authorization System

This document explains how the TET Bloom authentication and authorization system works.

## Overview

The TET Bloom platform uses Supabase for authentication and implements a role-based access control system with three user roles:

1. **Super User** - Manages system-level configurations, creates and manages all user accounts, and can perform all actions
2. **School Leader (Observer)** - Creates and manages observation groups, conducts observations, provides feedback
3. **Teacher** - Submits lesson plans, views their observations, and responds to feedback

## Environment Setup

To use the authentication system, you need to create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Database Schema

The authentication system relies on the following tables in your Supabase database:

1. **auth.users** (managed by Supabase) - Stores basic user authentication data
2. **user_profiles** - Stores application-specific user data including:
   - id (matches auth.users UUID)
   - email
   - role ('super_user', 'school_leader', or 'teacher')
   - fullName
   - employmentStartDate (optional)
   - yearsOfExperience (optional for teachers)
   - subject (optional for teachers)
   - grade (optional for teachers)

## Key Components

### 1. Authentication Context (`/src/lib/auth-context.tsx`)

The `AuthProvider` component handles:
- User authentication state
- Sign in/sign out operations
- User profile management
- Session persistence

Usage:
```tsx
import { useAuth } from '@/lib/auth-context';

// In your component
const { user, isAuthenticated, isLoading, signIn, signOut } = useAuth();
```

### 2. Authorization Context (`/src/lib/auth-permissions.tsx`)

The `AuthPermissionsProvider` component handles:
- Role-based permissions
- Navigation menu items based on user role
- Permission checking for features

Usage:
```tsx
import { useAuthPermissions } from '@/lib/auth-permissions';

// In your component
const { hasPermission, userRole, sidebarItems } = useAuthPermissions();

// Check for a specific permission
if (hasPermission('canManageUsers')) {
  // Show user management UI
}
```

### 3. Protected Route Component (`/src/components/auth/protected-route.tsx`)

The `ProtectedRoute` component:
- Protects routes from unauthorized access
- Redirects unauthenticated users to login
- Can restrict routes to specific user roles

Usage:
```tsx
import { ProtectedRoute } from '@/components/auth/protected-route';

// Protect a page or component
<ProtectedRoute>
  <YourSecureComponent />
</ProtectedRoute>

// Restrict to specific roles
<ProtectedRoute allowedRoles={['super_user', 'school_leader']}>
  <AdminOnlyComponent />
</ProtectedRoute>
```

### 4. Navigation Sidebar (`/src/components/dashboard/sidebar.tsx`)

The sidebar component:
- Displays navigation based on user role
- Shows only items the user has permission to access
- Handles sign out

## Workflow

1. Users authenticate through the login page
2. Upon successful authentication, they're redirected to their role-specific dashboard
3. UI elements are conditionally rendered based on permissions
4. Protected routes ensure users can only access authorized pages

## Testing Locally

When testing locally, you'll need a Supabase project with:
1. Email authentication enabled
2. A `user_profiles` table with the schema described above
3. Users created with appropriate roles

## Security Considerations

1. Client-side role checks are for UI purposes only
2. Always implement server-side authorization checks for API routes
3. Use Row Level Security in Supabase for data access control
4. Keep your Supabase environment variables secure 