# Test User Accounts Setup

This document explains how to set up test user accounts for the TET Bloom application.

## Prerequisites

1. Make sure your Supabase project is set up with the correct tables:
   - `auth.users` (managed by Supabase)
   - `user_profiles` with the appropriate columns: id, email, role, fullName, etc.

2. You need to have the following environment variables in your `.env.local` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   ```

   You can find these values in your Supabase project dashboard:
   - Go to Project Settings -> API
   - Copy the values for "Project URL", "anon public" key, and "service_role" key

## Running the Seed Script

To create test user accounts, run:

```bash
npm run seed:users
```

This will create the following test accounts:

1. **Super User**
   - Email: super@example.com
   - Password: SuperPass123!
   - Role: super_user

2. **School Leader**
   - Email: leader@example.com
   - Password: LeaderPass123!
   - Role: school_leader

3. **Teacher**
   - Email: teacher@example.com
   - Password: TeacherPass123!
   - Role: teacher

## Logging In

After running the seed script, you can log in with any of these accounts at `/login` in your application. You'll be automatically redirected to the appropriate dashboard based on your role:

- Super User → `/dashboard/super`
- School Leader → `/dashboard/leader`
- Teacher → `/dashboard/teacher`

## Customizing Test Users

If you want to modify the test user accounts or add more, you can edit the `testUsers` array in `scripts/seed-users.js`. 