# Campus Gist — Architecture Overview

## Deployment boundaries

- Flutter mobile clients communicate with Supabase using the project URL and publishable key.
- Supabase Auth identifies users; Postgres Row Level Security is the authorization boundary.
- Supabase Storage will hold approved profile, post and accommodation media.
- Supabase Edge Functions will handle privileged workflows and integrations (news ingestion, moderation actions, notifications and AI orchestration).
- Vercel will host the public web experience and admin dashboard. Privileged secrets remain server-side.

## Multi-campus data model

`universities` contains institutions; `campuses` belongs to a university. User profiles, posts, news, power reports, accommodation and campus locations are scoped to a campus where applicable. This allows FUTA to launch first without hard-coding FUTA as the only institution.

## Initial database domains

| Domain | Tables |
| --- | --- |
| Institutions | universities, campuses |
| Identity and permissions | profiles, campus_roles |
| News | news_sources, news_posts |
| Community | posts, comments |
| Campus Power Update | hostel_power_reports |
| Accommodation | accommodation_listings |
| Maps | campus_locations |
| Engagement and safety | notifications, content_reports |

## Trust and moderation

- News records have draft/review/published/rejected/archive states.
- Source records carry a trust flag and activation state.
- Accommodation listings begin in pending review; publication and verification are separate fields.
- Power reports record contributor, report time, expiry and confirmation status. The client should never present expired reports as current.
- Content reports are private to the reporter; moderation workflows will be performed by authorised server-side/admin roles.

## Initial security model

- RLS is enabled for every table in the exposed public schema.
- Public read access is limited to public directory/content use cases.
- User-owned writes check `auth.uid()` against the owner/contributor field.
- News publishing and privileged moderation remain server-side until a complete role-based admin workflow is implemented.
- Do not use user-editable metadata as an authorization source.
- Never expose service-role or secret API keys to client applications.

## Planned delivery sequence

1. Foundation: schema, auth, onboarding, campus selection and news feed.
2. Campus Power Update and verified news contribution workflow.
3. Social posts, comments, moderation and notifications.
4. Accommodation listings, map and inspection requests.
5. Academic hub, events, opportunities, business directory and marketplace.
6. Admin dashboard, trusted-source integrations and AI assistant.
