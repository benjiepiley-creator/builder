# RiskRadar backend readiness notes

RiskRadar is currently local-first for the MVP. The app is structured so backend services can be switched in without rewriting screens.

## Before launch

- Move OpenAI calls out of the mobile app and into a Supabase Edge Function or another trusted backend. Direct mobile calls are supported only for MVP development because public Expo environment variables are visible in the client bundle.
- Add authentication after the product flow is validated. The database schema already includes nullable `user_id` on `scans`.
- Enable Row Level Security after auth is live and policies can scope rows by authenticated user.
- Upload images to Supabase Storage from a backend-aware service, then save URLs in `scan_images`.
- Add server-side rate limiting per user, device, and IP to protect AI spend.
- Add structured logging for scan requests, AI failures, validation failures, and storage errors.
- Add analytics events for onboarding completion, scan creation, report save, upgrade modal shown, and report share.
- Replace the local subscription mock with RevenueCat. Keep the existing plan model: Free, Pro, Premium.
- Add App Store Terms and Privacy URLs before release.

## Suggested Supabase tables

The SQL schema is available at `src/services/supabase/schema.sql`.

Tables:

- `scans`
  - `id uuid primary key`
  - `user_id uuid null`
  - `category text`
  - `item_title text`
  - `asking_price numeric`
  - `location text`
  - `listing_description text`
  - `seller_messages text`
  - `notes text`
  - `overall_risk_score integer`
  - `verdict text`
  - `recommendation text`
  - `ai_report jsonb`
  - `created_at timestamp with time zone`
- `scan_images`
  - `id uuid primary key`
  - `scan_id uuid references scans(id)`
  - `image_url text`
  - `created_at timestamp with time zone`

## Edge Function shape

Recommended endpoint:

`POST /functions/v1/analyze-purchase`

Input mirrors the `ScanInput` type. Output must validate against `aiReportSchema`.

Keep the current `services/ai/aiService.ts` interface and replace only its transport implementation when the backend is ready.
