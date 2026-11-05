# Campus Gist — Master AI Development Guide

**Repository:** `Cletus-Tech/Campus-gist-`  
**Planning baseline:** November 2026  
**Initial launch campus:** FUTA Main Campus, Akure, Nigeria  
**Product promise:** Everything Campus. One Platform.  
**Status:** Implementation instructions based on a read-only audit of the repository's `main` branch.

This document is the working instruction set for developers and AI coding agents. It supplements the approved Campus Gist Full Product Plan; it does not replace that plan. If a new requirement conflicts with the master plan, stop and request a product decision instead of silently changing scope.

---

## 1. Non-negotiable instructions for every coding agent

1. **Inspect before editing.** Read the relevant files, package versions, migrations and existing patterns before changing anything.
2. **Preserve working code.** Extend the existing Flutter, Next.js and Supabase foundation. Do not recreate the repository or replace working modules without evidence and approval.
3. **Work in small phases.** Complete one phase, run its checks, report the result and wait for review before starting the next phase.
4. **No fake functionality.** No dead buttons, simulated success messages, invented live data, random prices, fabricated campus information or placeholder actions presented as complete.
5. **Database-backed operational content.** News, campus locations, hostel reports, accommodation, events, transport fares, opportunities and admin-managed content must come from Supabase or an explicitly approved configuration source.
6. **Admin-managed content.** Administrators must be able to create, review, publish, update, archive and remove appropriate content through the admin interface without editing source code.
7. **Server-enforced permissions.** Hiding a button is not authorization. Enforce permissions in RLS and trusted server-side operations. Never trust a role supplied by the browser, app, query string or user-editable profile metadata.
8. **Secrets stay private.** Only publishable Supabase keys may be used in client applications. Never expose service-role keys, secret keys, database passwords or private provider tokens in Flutter assets, browser bundles, committed files or logs.
9. **Campus tenancy is mandatory.** Every campus-owned record must be scoped to the correct university/campus. Do not assume all users or content belong to FUTA forever.
10. **Trust and freshness are visible.** Show source, publication/report time, status and verification context where relevant. Expired or unconfirmed information must never look live or verified.
11. **Mobile-first and data-conscious.** Test small Android screens, low/mid-range devices and slower mobile networks. Paginate feeds and optimise media.
12. **Accessible and consistent.** Use shared components, semantic labels, readable contrast, keyboard/focus states on web and usable touch targets.
13. **No destructive database shortcuts.** Never reset, drop, truncate, rewrite production tables or edit an already-applied migration to make a new schema change. Add a new reviewed migration.
14. **No unapproved external integrations.** Do not scrape private WhatsApp groups or restricted social sources. Use approved sources, permitted APIs, partner submissions or editor workflows.
15. **Keep documentation current.** Update this guide, the README, architecture notes and migration notes when decisions or implemented capabilities change.
16. **Report honestly.** Distinguish implemented, tested, partially implemented, blocked and not started. A successful build does not prove a feature works end-to-end.

## 2. Repository audit — observed baseline

The audit inspected the public GitHub repository's default `main` branch and its tracked files. It did not run the code locally, inspect the Vercel dashboard, or verify a live Supabase project's current schema or policies.

### 2.1 Repository metadata

- Repository: `Cletus-Tech/Campus-gist-`
- Default branch: `main`
- Visibility: public
- Repository contains a monorepo-style root package with an npm workspace for `apps/*`.
- Root scripts currently expose `dev:web` and `build:web`.

### 2.2 Existing tracked structure

```text
.
├── .gitignore
├── README.md
├── package.json
├── apps/
│   ├── mobile/
│   │   ├── lib/main.dart
│   │   └── pubspec.yaml
│   └── web/
│       ├── .env.example
│       ├── next.config.ts
│       ├── package.json
│       ├── tsconfig.json
│       └── src/app/
│           ├── globals.css
│           ├── layout.tsx
│           └── page.tsx
├── docs/
│   └── architecture/overview.md
└── supabase/
    └── migrations/
        └── 20261104180000_initial_campus_gist_schema.sql
```

The recursive tree showed no tracked `apps/admin/`, `supabase/functions/`, `supabase/config.toml`, automated test suite, CI workflow or committed dependency lockfile at the time of audit. Re-check before relying on this inventory because the repository may change.

### 2.3 Flutter application

Observed in `apps/mobile/lib/main.dart`:

- Flutter app starts with Riverpod's `ProviderScope`.
- One static `CampusHomePage` is currently rendered.
- The home page includes a Campus Power Update information card and four navigation/service entries.
- The five-item bottom navigation is displayed, but its destinations do not yet change screens.
- The service list's `onTap` callbacks are empty.
- The notification action has an empty callback.
- The Power Update card currently displays explanatory placeholder copy, not live reports.

Observed dependencies in `apps/mobile/pubspec.yaml` include Flutter, `supabase_flutter`, `flutter_riverpod` and `go_router`. No feature-level folders or application routing implementation appeared in the audited tree.

**Conclusion:** Flutter is a starter UI shell, not a working student app. Do not describe its visible controls as implemented functionality.

### 2.4 Next.js web application

Observed in `apps/web/src/app/page.tsx` and `globals.css`:

- The current route is a static marketing/landing page.
- It presents Campus Gist, four product highlights and links to page anchors.
- It is not a live student dashboard, authenticated application or admin portal.
- The design already uses a deep ink/navy base, lime accent and warm neutral surface.
- The page is responsive at the CSS breakpoint level, but it has not been browser/device tested in this audit.

Observed in `apps/web/package.json`:

- Next.js 15.5, React 19 and TypeScript 5.9 are declared.
- Supabase JS and SSR packages are declared.
- No Supabase client/server helper files, authentication routes, admin routes, feature modules or tests appeared in the tracked tree.

**Conclusion:** Keep the current public landing page as the public website starting point. Build authenticated student web experiences and admin routes deliberately; do not mistake the marketing page for either one.

### 2.5 Supabase repository baseline

The repository contains one tracked migration:

`supabase/migrations/20261104180000_initial_campus_gist_schema.sql`

It creates the initial 13 tables:

- `universities`
- `campuses`
- `profiles`
- `campus_roles`
- `news_sources`
- `news_posts`
- `posts`
- `comments`
- `hostel_power_reports`
- `accommodation_listings`
- `campus_locations`
- `notifications`
- `content_reports`

The migration enables RLS on those tables, adds indexes and policies, grants table privileges, and seeds FUTA and FUTA Main Campus.

Important observations requiring a security review before public launch:

- The profile SELECT policy currently makes every profile row publicly readable. Decide which profile fields should be public and separate private fields if needed.
- The posts SELECT policy currently permits reading any row with a non-null campus ID, rather than enforcing the viewer's campus membership/visibility rules. Define and test the intended campus access model.
- Comments currently have a public SELECT policy. Confirm whether comments on hidden, private or moderated posts can be exposed through this policy.
- The current campus role table allows users to read their own assignments, but the migration does not yet provide a complete trusted role-management workflow.
- The initial migration has no complete privileged admin publishing/moderation workflow. Do not grant clients direct privileged actions as a shortcut.
- Power reports have expiry timestamps, but the full confirmation/conflict/freshness workflow is not implemented in the repository.
- Storage buckets and storage object policies are not represented in the tracked migration.
- The migration file says it was applied directly to Supabase on 2026-11-04. Do not edit it in place. Confirm live migration history and schema before adding a new migration.

These are code-level observations, not a verified penetration test or a statement about the live database's current state.

### 2.6 Supabase project selection blocker

The connected Supabase account lookup returned **two active projects with the same display name**, both in `eu-west-1`:

- `xgdngnekihhnkzurhvpe` — created 2026-11-01
- `lvpetmhhspuagbjojlks` — created 2026-11-03

The repository's `.env.example` contains only placeholders and does not identify which project is the canonical Campus Gist project. The audit therefore did not query or modify either database.

**Required before any live database inspection or migration:** the project owner must confirm which project reference is the intended Campus Gist production/development project and label the environments clearly. Do not guess based on the project display name.

### 2.7 Deployment and runtime checks still outstanding

This read-only repository audit did not verify:

- Which Vercel project is linked to this repository or its configured root directory.
- Whether the current deployment succeeds.
- Whether production/preview environment variables are correctly configured.
- Whether the live Supabase schema matches the tracked migration.
- Whether auth providers, email templates, storage buckets or RLS policies are correctly configured.
- Whether Flutter builds on the user's development machine.

These checks are Phase 0 tasks, not assumed successes.

---

## 3. Target architecture and folder conventions

Retain the existing monorepo and use the following direction. Add folders only when the corresponding phase begins; do not generate empty placeholder modules for every future feature.

```text
.
├── apps/
│   ├── mobile/                       # Flutter Android-first app; iOS-ready structure
│   │   └── lib/
│   │       ├── app/                  # app bootstrap, router, theme
│   │       ├── core/                 # shared config, errors, utilities, widgets
│   │       └── features/
│   │           ├── auth/
│   │           ├── onboarding/
│   │           ├── home/
│   │           ├── news/
│   │           ├── power/
│   │           ├── notifications/
│   │           └── profile/
│   └── web/                          # Next.js public site, student web and admin routes
│       └── src/
│           ├── app/
│           │   ├── (public)/
│           │   ├── (auth)/
│           │   ├── (student)/
│           │   └── admin/
│           ├── components/
│           ├── features/
│           ├── lib/
│           │   └── supabase/
│           └── types/
├── docs/
│   ├── architecture/
│   └── implementation/
├── supabase/
│   ├── migrations/
│   └── functions/                    # add when privileged workflows are implemented
└── package.json
```

The admin portal should initially live within the existing Next.js app under an `/admin` route group/route tree. Do not create a second Next.js application unless a later architecture decision justifies it.

### Design system

Use the product plan's design direction as the approved baseline:

- Deep navy/ink foundation.
- Lime/green accent.
- Warm white and light neutral grey surfaces.
- Semantic green, amber, red and blue states, always accompanied by text/icons.
- Shared spacing, typography, radii, elevation, button and input tokens.
- Professional, clear, student-friendly UI; avoid childish styling and generic emoji decoration.

The uploaded purple mockup is a screen-layout reference, not permission to override the approved navy/green brand system. If the product owner later chooses purple, record that decision here and update all tokens consistently.

---

## 4. Phase-by-phase implementation plan

Each phase must produce working functionality, tests and a concise completion report. Dependencies between phases are intentional.

### Phase 0 — Repository, environment and live-system verification

**Goal:** establish a trustworthy baseline before feature development.

Tasks:

1. Clone the existing repository and inspect the current branch and working tree.
2. Confirm Node/npm, Flutter/Dart and Supabase CLI versions; consult each installed tool's help before using unfamiliar commands.
3. Install dependencies and create/commit the correct lockfiles. Do not upgrade framework versions as incidental cleanup.
4. Run the current web build and Flutter analysis/build. Record exact errors without masking them.
5. Confirm Vercel project linkage, framework preset, root directory and preview/production environment-variable names.
6. Ask the owner to identify the canonical Supabase project reference because two active projects were found.
7. Once confirmed, read live tables, migration history, RLS/security advisors, project URL and configured auth providers. Do not make schema changes in this phase.
8. Compare live schema with the tracked baseline and write a drift report.
9. Confirm the initial FUTA university/campus seed records exist exactly once.
10. Create a short environment setup guide without copying secrets into the repository.

**Expected files:** `docs/implementation/ENVIRONMENT_SETUP.md`, updated audit notes and any necessary lockfiles.

**Acceptance gate:**

- Web build and Flutter analysis results are recorded.
- Canonical Supabase project is identified.
- Live schema/migration drift is documented.
- No production data or schema was modified.
- Known blockers and environment setup steps are explicit.

### Phase 1 — Shared foundation, routing and design system

**Goal:** turn the starter shells into maintainable app foundations.

Web tasks:

- Add typed Supabase browser and server clients using the supported SSR pattern.
- Keep server-only code and secrets out of client components.
- Establish route groups, shared layouts, loading/error/not-found states and typed environment validation.
- Add shared design tokens and reusable accessible components.
- Preserve the existing public landing page and its visual identity.

Flutter tasks:

- Split the single `main.dart` screen into app bootstrap, theme, router and feature modules.
- Configure Riverpod providers and GoRouter routes.
- Add central configuration and error handling.
- Establish reusable buttons, fields, cards, navigation, loading, empty and error states.
- Keep app startup stable when a user is signed out or offline.

**Acceptance gate:**

- Existing landing page still builds.
- Flutter app starts and navigates between implemented shell routes.
- No placeholder action is labelled as complete.
- Shared UI tokens/components are used rather than duplicated ad hoc styles.
- No secrets are committed.

### Phase 2 — Authentication, onboarding and student profile

**Goal:** students can securely register, sign in and select their campus.

Tasks:

- Implement configured Supabase authentication flows: sign-up, sign-in, email verification/resend, sign-out and password recovery.
- Implement session restoration and expired-session handling.
- Build onboarding for university and campus selection; FUTA Main Campus is the initial option.
- Explain location permission as optional and provide manual selection.
- Create/update the user's profile with unique username validation.
- Keep department and level optional and privacy-controlled.
- Add account security, privacy and deletion-request entry points.
- Never allow users to assign themselves privileged roles.

**Likely files:**

- Web: `apps/web/src/app/(auth)/`, `apps/web/src/app/(student)/onboarding/`, `apps/web/src/lib/supabase/`
- Flutter: `apps/mobile/lib/features/auth/`, `apps/mobile/lib/features/onboarding/`, `apps/mobile/lib/features/profile/`
- Database: a new migration only after Phase 0 live-schema comparison.

**Acceptance gate:**

- New user completes sign-up, verification and sign-in.
- Returning user session restores correctly.
- User can select FUTA Main Campus.
- User can edit only permitted profile fields.
- User cannot self-promote or modify another user's profile.
- RLS tests cover anonymous, student and privileged roles.

### Phase 3 — Home dashboard, news and editorial workflow

**Goal:** the home screen shows useful, current campus information from trusted sources.

Tasks:

- Build the home dashboard using the agreed hierarchy: campus identity, current Power Update summary, important announcement strip, category filters, latest updates and service shortcuts.
- Build news list/detail screens with source, category, publication time and verification state.
- Add search/category filters and paginated loading.
- Create editor workflow: draft → review → publish/reject → archive/correct.
- Add source management for approved official sources and authorised campus contributors.
- Record who published or corrected content and when.
- Clearly distinguish official announcements from community-submitted tips.
- Keep content admin-managed; do not hardcode news in UI components.

**Acceptance gate:**

- Editor can create a draft and publish through an authorised server-side workflow.
- Student sees only published content for the selected campus and permitted public items.
- Source and timestamps appear correctly.
- Pagination, empty state, loading state and error retry work.
- Unauthorised users cannot publish or alter editorial status.

### Phase 4 — Campus Power Update

**Goal:** deliver the signature campus utility with reliable freshness and confirmation rules.

Tasks:

- Build hostel/location selector and current status dashboard.
- Support statuses from the product plan: light available, no light, power restored, power interrupted and unconfirmed.
- Build report submission with location, status and optional note.
- Show report time, expiry, recent report count and confidence/confirmation state.
- Add independent confirmation/dispute workflow; prevent one account from manufacturing consensus.
- Preserve report history; never overwrite the audit trail.
- Expire or visibly mark stale reports.
- Add user subscriptions and notifications for meaningful status changes in a later notification integration step.
- Add admin conflict-resolution and abusive-contributor controls.
- Make clear that status is community-reported, not automatically detected from the electricity grid.

**Acceptance gate:**

- Authenticated student can submit a report for a configured location.
- Another eligible user can confirm/dispute according to policy.
- Expired reports are never presented as current.
- Conflicting reports show an unconfirmed/conflict state.
- Admin actions and report history are auditable.
- Rate limiting and RLS tests pass.

### Phase 5 — Admin portal, roles and moderation

**Goal:** give authorised staff secure operational control of the MVP.

Build the web admin area in `apps/web/src/app/admin/` with:

- Overview and operational alerts.
- News/editorial manager.
- Power report manager.
- Community moderation queue.
- User and campus role manager.
- Campus/location configuration.
- Content reports and appeals.
- Audit log.

Roles must follow least privilege. The product plan's roles include super admin, campus admin, news editor, moderator, accommodation manager, transport manager and academic editor. A student is a normal account state, not an administrative privilege.

Tasks:

- Define a permission matrix before coding.
- Implement server-side permission checks and database policies.
- Use trusted server-side operations for privileged role assignment, publishing, removal and suspension.
- Require reason codes for sensitive moderation actions.
- Record actor, action, target, reason and timestamp in audit logs.
- Provide appeal/contact workflow.
- Do not trust user-editable metadata for authorization.

**Acceptance gate:**

- Each role sees and can execute only its permitted actions.
- Direct API calls cannot bypass the UI permission model.
- Role assignment/revocation is restricted to authorised administrators.
- Sensitive actions create audit records.
- RLS and server authorization tests pass.

### Phase 6 — Student community and notifications

**Goal:** enable safe student-to-student participation.

Community tasks:

- Create/edit/delete own posts under retention policy.
- Support approved image/media uploads with file validation and storage policies.
- Add comments, reactions, saves, follows and sharing.
- Add report, block and mute controls.
- Add groups/department communities after campus membership and moderation are stable.
- Keep anonymous confessions disabled until governance and safety processes are explicitly approved.
- Do not launch private direct messaging before reporting, blocking and moderation are ready.

Notification tasks:

- Build in-app notification centre and preferences.
- Separate announcements, followed topics, power updates, comments/replies, events and account/security.
- Add device-token registration and push delivery only after provider setup and consent.
- Respect quiet hours and user preferences; avoid noisy notifications.

**Acceptance gate:**

- Users can manage their own posts and comments only.
- Moderators can hide/restore/remove content with a reason.
- Users can report/block/mute.
- Notification preferences are honoured.
- Media access and upload ownership are protected.

### Phase 7 — Accommodation and Explore

**Goal:** provide verified campus services and discoverable locations.

Accommodation tasks:

- Search/filter listings by campus, area, price, property type and facilities.
- Detail page with gallery, description, facilities, payment terms, map area and owner/agent contact.
- Submission flow for owner/agent.
- Admin review, verification, duplicate/scam checks and complaint workflow.
- Contact and inspection request.
- Show approximate public location unless exact sharing is authorised.
- Display a clear disclaimer that the platform does not guarantee a property or transaction.

Explore/map tasks:

- Build searchable points of interest: faculties, lecture theatres, libraries, hostels, gates, health facilities and approved places.
- Provide map/list toggle and manual search without location permission.
- Add directions and distance estimates only when a suitable provider is selected and configured.
- Do not invent map pins or claim real-time routing without a working map integration.

**Acceptance gate:**

- Only approved/published listings are publicly discoverable.
- Owner edits do not bypass moderation rules.
- Users can report suspicious listings.
- Campus locations are database-managed.
- Location permission is optional and manual search works.

### Phase 8 — Transport information, events and academic hub

**Transport information first:**

- Routes, stops, operating hours and published fares.
- Data source and last-updated timestamp.
- User report for incorrect route/fare.
- Do not activate shuttle booking, driver onboarding or live tracking until operational partners, safety review and support processes exist.

**Events and opportunities:**

- Event submissions, organiser details, approval, detail pages and calendar actions.
- Automatically remove expired events from upcoming views.
- Opportunities for scholarships, internships, competitions and careers.
- Save deadlines and optional reminders.

**Academic hub:**

- Academic calendar and authorised department announcements.
- Timetables/course information only when supplied by authorised sources.
- Learning resources only where rights and permissions allow.
- Show academic year/semester and last-updated time.
- Never invent exam dates, course details or institutional policies.

**Acceptance gate:**

- Every item has an identifiable source/owner and update time.
- Submitted events are reviewed before publication.
- Expired events are not listed as upcoming.
- Academic information is permission-checked and clearly dated.

### Phase 9 — Business directory and marketplace discovery

**Goal:** add campus commerce without taking custody of money prematurely.

Tasks:

- Business profiles, categories, service areas, hours and contact details.
- Marketplace listing categories, photos, descriptions, price and seller profile.
- Search/filter and safe contact relay where approved.
- Report listing, block seller and flag suspicious activity.
- Start as discovery/contact only.
- Do not add checkout, escrow, wallet or payment custody until legal, payment, dispute and operational processes are approved.

**Acceptance gate:**

- Listings are moderated and reportable.
- Sellers cannot impersonate verified businesses.
- No payment is collected or promised in the discovery-only release.

### Phase 10 — AI assistant and advanced integrations

**Goal:** introduce Ask Campus Gist only after the platform has reliable approved content.

Tasks:

- Retrieve answers only from approved, indexed Campus Gist content.
- Display source links and timestamps.
- Say clearly when the answer cannot be verified.
- Never invent policies, exam dates, accommodation availability, transport fares or power status.
- Add answer feedback/reporting and human escalation.
- Add advanced personalisation only with transparent user controls.
- Add shuttle booking/driver workflows only after operational agreements and safety procedures.
- Add integrations only through permitted APIs and approved sources.

**Acceptance gate:**

- Every factual answer can be traced to approved current source material.
- Unanswerable questions produce an honest limitation.
- Safety-sensitive or disputed information is escalated.
- No unapproved scraping is used.

### Phase 11 — Beta, public launch and multi-campus expansion

Tasks:

- Recruit a small, diverse FUTA beta group and trusted hostel contributors.
- Train editors and moderators.
- Test real workflows across selected hostels.
- Run unit, component/widget, integration, RLS, admin permission, API, accessibility and performance tests.
- Test backup restoration and incident response.
- Publish privacy policy, terms, community rules, listing disclaimers and support contacts.
- Monitor crash-free sessions, API latency/errors, report freshness, moderation response and listing complaints.
- Fix critical safety/security issues before public launch.
- Add another university only after the FUTA operational playbook is repeatable.

**Acceptance gate:**

- MVP acceptance criteria from the master product plan pass in staging.
- No unresolved critical security issues.
- Support, moderation, backup and incident ownership are defined.
- Launch monitoring and rollback procedures are ready.

---

## 5. Required engineering workflow for every phase

Before coding:

1. State the phase goal and relevant acceptance criteria.
2. List the exact files and database objects to inspect.
3. Identify dependencies and security implications.
4. Confirm whether a new migration or environment variable is required.
5. Preserve unrelated user changes.

During coding:

1. Implement the smallest coherent end-to-end slice.
2. Keep UI, data access and business logic separated.
3. Validate all input on trusted boundaries.
4. Handle loading, empty, error and retry states.
5. Add tests for success, failure and permission boundaries.
6. Update documentation.

After coding:

1. Run formatting, lint/static analysis, type checks and tests.
2. Run the production build.
3. Test the actual user workflow on relevant screen sizes.
4. Review RLS and admin permissions for any data change.
5. Report changed files, migrations, environment variables, commands run and test results.
6. List unresolved issues and explicitly mark anything not implemented.
7. Stop for owner review before moving to the next phase.

### Required phase report format

```text
PHASE:
STATUS: Complete / Partial / Blocked

IMPLEMENTED:
- ...

FILES CHANGED:
- ...

DATABASE:
- Migration(s):
- RLS/policy changes:
- Storage/function changes:

ENVIRONMENT:
- New variables (names only; never values):
- Dashboard configuration:

TESTS RUN:
- Command:
- Result:

MANUAL TESTS:
- Device/browser:
- Workflow:
- Result:

KNOWN ISSUES:
- ...

NEXT PHASE:
- ...
```

## 6. Product scope guardrails

The visual reference contains screens for shuttle booking and Ask Campus Gist. These are long-term product concepts, not proof that those services are available for the first release.

Use the master plan's staged release strategy:

- **Release 0:** foundation.
- **Release 1:** useful MVP — authentication/profile, campus selection, home feed, approved news, Power Update, submit-a-tip, notifications, search, admin dashboard and moderation/safety.
- **Release 2:** student community, groups, events and saved content.
- **Release 3:** accommodation, business directory, map, transport information and marketplace discovery.
- **Release 4:** academic information and opportunities.
- **Release 5:** AI assistant, advanced personalisation, shuttle workflows and multi-university administration.

Do not silently move a Release 5 capability into the MVP because a mockup depicts it.

## 7. Immediate next actions

1. Confirm which Supabase project reference is the canonical Campus Gist environment.
2. Run local dependency installation and baseline builds on the developer machine.
3. Confirm Vercel's repository link and `apps/web` root configuration.
4. Compare the selected live Supabase project with the tracked initial migration and record schema/RLS drift.
5. Resolve the security review findings before enabling public student data access.
6. Start Phase 1 only after the Phase 0 gate is satisfied.

**Guiding rule:** Build a reliable campus utility first, then grow it into a full campus ecosystem. Every feature needs an owner, data source, safety process, UI flow and measurable acceptance criteria.
