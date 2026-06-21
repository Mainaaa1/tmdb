# Filamu

A polished TMDB movie discovery app built with Next.js, TanStack Query, Tailwind CSS, and a mock authenticated session flow.

## Why this stack?

- **Next.js App Router**: Enables server components, route-based rendering, and built-in API routes for secure server-side logic.
- **TanStack Query**: Provides async caching, background fetching, and UI-friendly stale-while-revalidate behavior for movie lists, details, and related items.
- **Tailwind CSS**: Makes responsive design fast and consistent while keeping the UI implementation maintainable with utility-first styling.
- **HttpOnly cookie sessions**: Keeps authentication state secure and prevents client-side token leaks.
- **Local storage watchlist**: Offers a simple persistent client experience without requiring a backed watchlist service.

## Architecture overview

The app is organized into a server-backed shell with client components handling interactive features:

- `src/app/layout.tsx` and `src/components/layout/app-shell.tsx` compose the global UI, metadata, and protected header/footer.
- `/app/api/*` routes implement TMDB proxying and mock auth endpoints, isolating API keys and session logic from the browser.
- `src/components/dashboard/dashboard-client.tsx` is the main interactive dashboard, handling search, pagination, cached query loading, and watchlist display.
- `src/components/movie/movie-detail-client.tsx` manages the movie detail page, watchlist toggles, and trailer/watch actions.
- `src/lib/*` contains shared helpers for auth, TMDB requests, formatting, and client API utilities.

### Data flow

Client UI -> React Query -> Next.js API -> TMDB

1. The dashboard and movie detail components request data through `fetch` calls to `/api/movies/*`.
2. Next.js API routes relay requests to TMDB using the server-side API key.
3. Auth state is validated in middleware and server components using session cookies.
4. Watchlist interactions update `localStorage` and local React state for immediate feedback.

### Architecture decisions

- **Server API proxy** avoids exposing the TMDB API key to the browser and centralizes request logic.
- **React Query** keeps list/detail state separate, which improves cache reuse and prevents unnecessary refetches when navigating between pages.
- **URL-backed search/pagination** makes discovery shareable and keeps the UI in sync with browser history.
- **Component-level watchlist state** allows the dashboard to render saved movies immediately while keeping the feature lightweight.
- **Auth middleware + protected routes** ensures only authenticated users can access sensitive pages without duplicating checks in every component.

## Features

- Protected dashboard and movie detail routes with session-based authentication
- HttpOnly cookie session login/logout and route protection
- TMDB-powered trending, search, and movie detail browsing
- Debounced search input with URL-backed pagination for shareable state
- Watchlist support persisted in local storage with removal from dashboard
- Skeleton loaders, error states, and responsive UI polish

## Data fetching

- Uses `@tanstack/react-query` for cached list and detail fetching
- Movie list queries refresh on search and page changes
- Detail pages fetch movie info and similar titles separately
- Server endpoints proxy TMDB requests and pass credentials securely

## Authentication

- Login/logout handled by `/api/auth` routes
- Session cookies are HttpOnly and route-protected
- Dashboard and movie pages require a valid session to access
- Auth state is read from cookie headers in server components

## UI

- Tailwind CSS styling with custom theme tokens and glassmorphism accents
- Responsive movie cards, detail views, and dashboard layout
- Custom header, footer, and watchlist panel for a polished experience
- Favicon and app branding aligned across header and browser tab

## State management

- Search and pagination state is kept in component state and synced to the URL
- Watchlist state is persisted in `localStorage` and surfaced on the dashboard
- React Query caches movie data separately for lists, details, and similar movies
- Local state is used for instant UI feedback on watchlist actions

## Setup

1. Copy `.env.example` to `.env.local`
2. Add your TMDB API key
3. Set a long random `AUTH_SECRET`
4. Run `npm install`
5. Start the app with `npm run dev`

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run test`

## Notes

- Dashboard and detail pages are protected by session middleware.
- Auth is backed by an in-memory demo store in this repository, so user credentials are not persisted to disk.
- Search and pagination state is encoded in the URL for shareable views.
- For deployment, add your environment variables and run `npm run build`.
