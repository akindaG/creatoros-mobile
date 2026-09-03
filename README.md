# CreatorOS AI Mobile

Native mobile client for CreatorOS AI, built with Expo, React Native and TypeScript. It shares the existing CreatorOS FastAPI backend, PostgreSQL/Supabase data, media storage, Ollama/Qwen AI layer, analytics and Meta publishing services with the web application.

## Mobile features

- JWT registration, login and secure session persistence with Expo SecureStore
- Password reset request flow
- Home dashboard with CreatorOS KPI cards and best posting-time recommendation
- Content Studio for draft, scheduled, published and failed posts
- Create Post flow with image/video picker and backend media upload
- Edit post title, caption and target platform
- Schedule/reschedule/cancel publishing with native date/time selection
- Publish-now integration with the backend publishing service
- AI caption generator, hashtag generator and content analyzer
- Analytics dashboard, top posts and engagement metrics
- Content calendar for scheduled posts
- Facebook and Instagram token-based account connection/disconnection
- Editable profile, profile image upload and password change
- React Query caching and Zustand auth state
- EAS preview APK and production build configuration
- GitHub Actions TypeScript verification

## Architecture

```text
Expo / React Native mobile app
            |
            | HTTPS + JWT
            v
CreatorOS FastAPI backend
   |        |        |
Postgres  Storage  Ollama/Qwen
   |
Meta Graph API
```

The mobile app does not duplicate backend business logic. It calls the same `/api/v1` endpoints used by the CreatorOS web application.

## Requirements

- Node.js 22.13 or newer for Expo SDK 57
- npm
- Expo Go or an Android/iOS simulator
- Running CreatorOS API

## Setup

```bash
git clone https://github.com/akindaG/creatoros-mobile.git
cd creatoros-mobile
cp .env.example .env
npm install
npx expo install --fix
npm run typecheck
npx expo start
```

The included `.env.example` points to the deployed CreatorOS Railway backend. For a local backend on a physical phone, replace the URL with your computer's LAN address, for example `http://192.168.1.20:8000`.

## Android APK

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```

The `preview` EAS profile is configured to create an installable APK.

## Social account integration

The current CreatorOS backend implements Facebook and Instagram as token-based connections. The mobile Social Accounts screen therefore collects the platform account name and Meta access token and sends it to `/api/v1/social-accounts`. The backend encrypts the token at rest.

For full Meta OAuth, add an OAuth authorization/callback flow to `creatoros-api` first, then the mobile app can open that authorization URL using its `creatoros://` deep-link scheme.

## AI

AI requests are made through the backend:

- `POST /api/v1/ai/caption`
- `POST /api/v1/ai/hashtags`
- `POST /api/v1/ai/analyze`

The mobile device does not run Ollama or Qwen locally.

## Production environment

Set this as an EAS environment variable for release builds:

```text
EXPO_PUBLIC_API_URL=https://creatoros-api-production-ba9c.up.railway.app
```

## Project repositories

- Mobile: https://github.com/akindaG/creatoros-mobile
- Web: https://github.com/akindaG/creatoros-web
- API: https://github.com/akindaG/creatoros-api
- Documentation: https://github.com/akindaG/creatoros-docs
