# CreatorOS AI Mobile

Experimental post-MVP mobile client for CreatorOS AI, built with Expo, React Native, and TypeScript.

The originally approved CreatorOS V1 scope is the web application. This mobile repository is an additional extension that reuses the existing CreatorOS backend and should be presented as post-MVP work rather than as a replacement for the original V1 success criteria.

## Mobile features

- JWT registration and login
- Secure session persistence with Expo SecureStore
- Password reset request flow
- Home dashboard with KPI cards and best posting-time recommendation
- Content Studio for draft, scheduled, published, and failed posts
- Create Post flow with image/video picker and backend media upload
- Edit post title, caption, and target platform
- Schedule, reschedule, and cancel publishing
- Publish-now integration with the backend
- AI caption generator
- AI hashtag generator
- AI content analyzer
- Analytics dashboard
- Content calendar
- Social account listing and disconnection
- Manual token-entry social connection UI in the current mobile client
- Editable profile and password change
- React Query caching
- Zustand auth state
- EAS build configuration
- GitHub Actions TypeScript verification

## Architecture

~~~text
Expo / React Native mobile app
            |
            | HTTPS + JWT
            v
CreatorOS FastAPI backend
   |          |           |
PostgreSQL  Storage   AI Provider Layer
                         |
                         +--> Google Gemini
                         +--> Fallback
            |
            +--> Meta / Instagram APIs
~~~

The mobile application does not duplicate core backend business logic.

## Important difference from the web client

The backend now supports OAuth-based Facebook Page and Instagram connection flows.

The current mobile Social Accounts screen still uses manual token-entry through POST /api/v1/social-accounts. Therefore:

- do not describe the current mobile UI as OAuth-based
- do not describe the backend as token-entry only
- web users use the backend OAuth flows
- the mobile client can be upgraded later to launch those OAuth flows through its deep-link scheme

## AI

Mobile AI requests go through the FastAPI backend:

- POST /api/v1/ai/caption
- POST /api/v1/ai/hashtags
- POST /api/v1/ai/analyze

The phone does not run the AI model locally.

The backend handles AI requests with Google Gemini and can return deterministic fallback output when enabled.

## Requirements

- Node.js compatible with Expo SDK 57
- npm
- Expo Go or an Android/iOS simulator
- Running CreatorOS API

## Setup

~~~bash
git clone https://github.com/akindaG/creatoros-mobile.git
cd creatoros-mobile
cp .env.example .env
npm install
npx expo install --fix
npm run typecheck
npx expo start
~~~

For a local backend on a physical phone, use the computer's LAN address rather than localhost.

## Android preview build

~~~bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
~~~

## Project repositories

- Mobile: https://github.com/akindaG/creatoros-mobile
- Web: https://github.com/akindaG/creatoros-web
- API: https://github.com/akindaG/creatoros-api
- Documentation: https://github.com/akindaG/creatoros-docs
