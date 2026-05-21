# RiskRadar

RiskRadar is an Expo React Native mobile app for AI-assisted purchase risk analysis. It helps users scan marketplace listings, photos, seller messages, and item details before buying.

## MVP features

- Premium dark-mode mobile UI
- Three-slide onboarding
- Home dashboard with recent scans
- New scan workflow with category, price, location, listing text, seller messages, notes, and multiple image uploads
- Local image compression and base64 preparation for OpenAI vision
- Mock AI mode for local development
- Optional direct OpenAI integration when an API key is provided
- Strict Zod schema for AI JSON responses
- Risk report with score, verdict, breakdown, red flags, fair value, seller questions, and negotiation scripts
- Local saved scan history with AsyncStorage
- Supabase-ready storage service and SQL schema
- Subscription gate placeholder for Free, Pro, and Premium plans
- Settings screen with support, terms, privacy, and data reset placeholders

## Setup

```bash
npm install
cp .env.example .env
npm run start
```

By default the app uses mock AI:

```env
EXPO_PUBLIC_USE_MOCK_AI=true
```

To test OpenAI directly during MVP development:

```env
EXPO_PUBLIC_USE_MOCK_AI=false
EXPO_PUBLIC_OPENAI_API_KEY=your_key_here
```

> Production note: OpenAI API calls should be moved to a backend or Supabase Edge Function before launch. Expo public environment variables are visible in the mobile client bundle.

## Scripts

```bash
npm run start
npm run ios
npm run android
npm run web
npm run typecheck
npm run lint
```

## Environment variables

- `EXPO_PUBLIC_OPENAI_API_KEY`
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_USE_MOCK_AI`

## Architecture

```text
src/
  components/
  constants/
  hooks/
  navigation/
  schemas/
  screens/
  services/
    ai/
    storage/
    subscription/
    supabase/
  types/
  utils/
  styles/
```

Screens use reusable components and call store/service abstractions rather than backend APIs directly. The AI service validates all responses with Zod. Storage defaults to local AsyncStorage and includes Supabase-ready functions for future authenticated sync.

## Disclaimers

RiskRadar provides AI-assisted risk analysis and is not a guarantee of safety, authenticity, value, or legality. Always verify independently before purchasing.