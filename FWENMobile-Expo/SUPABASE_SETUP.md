# Supabase Setup Instructions

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in or create an account
2. Click **New Project**
3. Configure:
   - **Name**: FWEN
   - **Database Password**: Generate a strong password (save it somewhere safe)
   - **Region**: Choose closest to your users (e.g., eu-central-1)
4. Click **Create new project** and wait 2-3 minutes for initialization

## Step 2: Get Your Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy these values:
   - `Project URL` → This is your `EXPO_PUBLIC_SUPABASE_URL`
   - `anon` key → This is your `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## Step 3: Create `.env.local` File

In your project root (`FWENMobile-Expo/`), create a `.env.local` file:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
API_BASE_URL=http://localhost:3000/api
```

Replace the URL and key with your actual Supabase credentials.

## Step 4: Initialize Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `SUPABASE_SCHEMA.sql` from this project
4. Paste it into the SQL editor
5. Click **Run** to execute all tables, indexes, RLS policies, and demo data

**Note**: This creates:
- `users` table (extends Supabase auth)
- `districts` table (8 Ghanaian districts)
- `bus_routes` table (with pricing and delivery days)
- `parcels` table (main shipments data)
- `parcel_status_history` table (tracking timeline)
- `users_payment_methods` table (payment info)
- All RLS policies for security
- Demo data (districts and sample routes)

## Step 5: Enable Email Authentication

1. Go to **Authentication** > **Providers**
2. Ensure **Email** provider is enabled (it is by default)
3. Go to **Email Templates** and customize if needed
4. Go to **URL Configuration** and add your app's callback URLs:
   - For web: `http://localhost:8081` (dev), `http://localhost:3000` (prod)
   - For mobile: `exp://localhost:19000` (Expo), or your build URL for production

## Step 6: (Optional) Configure OAuth Providers

If you want Google/GitHub login:
1. Go to **Authentication** > **Providers**
2. Click on **Google** or **GitHub**
3. Follow provider-specific setup (create OAuth app, add credentials)
4. Update AppNavigator.js to add OAuth buttons

## Step 7: Test Connection

Run your app and the Supabase client will automatically load credentials from `.env.local`:

```bash
# For web
npm run web

# For mobile (you'll need EAS CLI)
expo start
```

If you see console warnings about missing credentials, double-check `.env.local` is in the root and values match exactly.

## Step 8: Verify RLS Policies

In Supabase SQL Editor, run this query to list all policies:

```sql
SELECT * FROM pg_policies;
```

You should see policies for: users, parcels, parcel_status_history, users_payment_methods, districts, bus_routes.

## Step 9: Check Demo Data

Verify demo districts and routes were created:

```sql
SELECT COUNT(*) FROM public.districts;  -- Should be 8
SELECT COUNT(*) FROM public.bus_routes; -- Should be 8
```

## Troubleshooting

**Issue**: "Supabase credentials not found in environment"
- **Solution**: Ensure `.env.local` exists in the root with correct keys (EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY)

**Issue**: RLS policy errors when querying
- **Solution**: Ensure you're authenticated (logged in user). Policies only grant access to owned data or public reads.

**Issue**: "Unknown or incorrect database name"
- **Solution**: This is normal during project creation. Wait another minute and retry.

**Issue**: Duplicate key errors when running schema
- **Solution**: The `ON CONFLICT DO NOTHING` clauses handle this. Safe to re-run.

## Environment Variables Summary

| Variable | Description | Example |
|----------|-------------|---------|
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project endpoint | `https://xyz123.supabase.co` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Public API key (safe to expose in client) | `eyJhbGc...` |
| `API_BASE_URL` | Backend API base URL | `http://localhost:3000/api` |

All three are required for full app functionality.

## Next Steps

1. Update Redux slices (`authSlice.js`, `parcelSlice.js`) to use Supabase client
2. Implement signup, send parcel, and track parcel screens
3. Test auth flow and parcel lifecycle
