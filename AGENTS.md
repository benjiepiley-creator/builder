# AGENTS.md

## Cursor Cloud specific instructions

### Project Overview

RiskRadar is an Expo SDK 55 / React Native mobile app for AI-assisted purchase risk analysis. It runs fully locally with mock AI mode (default) — no external services needed.

### Running the App

- **Dev server (web):** `npx expo start --web --port 8081`
- **Lint:** `npx eslint . --ext .ts,.tsx`
- **Type check:** `npx tsc --noEmit`
- Scripts are also in `package.json` (`npm run start`, `npm run lint`, `npm run typecheck`).

### Important Setup Notes

- Copy `.env.example` to `.env` before running. The default `EXPO_PUBLIC_USE_MOCK_AI=true` enables fully offline mock AI — no API keys needed.
- Web dependencies (`react-dom`, `react-native-web`, `@expo/metro-runtime`) must be installed for web mode: `npx expo install react-dom react-native-web @expo/metro-runtime`.
- `babel-preset-expo` is required as a devDependency for the Metro bundler to work.
- The `nativewind/preset` must be listed in `tailwind.config.js` presets for NativeWind v4 to initialize the Metro config.
- `nativewind/babel` is a Babel **preset** (not a plugin) and must be in the `presets` array of `babel.config.js`.
- There is no native iOS/Android simulator in Cloud Agent VMs. Use `--web` mode for testing.
- There are no automated tests in this project yet. Verify changes using type checking, linting, and manual web browser testing.
