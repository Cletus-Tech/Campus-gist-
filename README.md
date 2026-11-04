# Campus Gist

**Everything Campus. One Platform.**

Campus Gist is a multi-university campus information and community platform. The first rollout is designed for the Federal University of Technology, Akure (FUTA), with a data model that supports additional universities and campuses.

## Product modules

- Campus news, verified announcements and breaking updates
- Student profiles, posts, comments and moderated communities
- Accommodation listings with verification and reporting
- Campus Power Update: hostel-level electricity reports with timestamps and expiry
- Campus map and searchable campus locations
- Academic information, events, opportunities and marketplace (planned modules)
- Notifications and an AI campus information assistant (planned modules)
- Role-based editorial and moderation dashboard

## Technology

- **Mobile:** Flutter
- **Backend:** Supabase (Postgres, Auth, Storage, Realtime, Edge Functions)
- **Web/admin hosting:** Vercel
- **Source control:** GitHub

## Repository layout

```
apps/
  mobile/       # Flutter application (next implementation phase)
  web/          # Public website (planned)
  admin/        # Admin dashboard (planned)
supabase/
  migrations/   # Database schema migrations
  functions/    # Edge Functions (planned)
docs/
  architecture/ # Architecture and product decisions
```

## Current foundation

The Supabase project has been provisioned in `eu-west-1`. The initial database includes university/campus tenancy, profiles and roles, news sources and posts, social posts/comments, hostel power reports, accommodation listings, campus locations, notifications and content reports. Row Level Security is enabled on all public tables.

The initial seed data includes FUTA Main Campus, Akure, Ondo State.

## Development principles

1. Treat every campus-owned record as belonging to a university/campus.
2. Enable Row Level Security on every exposed table and write policies for each access pattern.
3. Never place Supabase secret/service-role keys in mobile or browser applications. Use the publishable key only with RLS.
4. Verify source provenance and editorial status before publishing collected news.
5. Expire stale power reports; show the report time and contributor context.
6. Build in phases: reliable campus information first, then community and service modules.

## Status

This repository contains the project foundation and database baseline. Flutter UI, web/admin interfaces, automated news collection, notifications and AI features are subsequent implementation phases.
