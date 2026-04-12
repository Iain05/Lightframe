# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lightframe is a self-hosted photography portfolio website. The frontend is a React/TypeScript/Vite SPA. It talks to a Java Spring backend (not in this repo) that handles auth, album/collection management, and photo storage via AWS S3.

## Commands

All commands run from the `lightframe/` directory:

```bash
npm run dev        # Start dev server on port 3000 (proxies /api to localhost:8080)
npm run build      # Type-check + Vite production build
npm run lint       # ESLint
npm run preview    # Preview production build on port 3000
```

## Environment Variables

The app requires a `.env` file in `lightframe/`:

- `VITE_API_URL` — Base URL of the Spring backend (e.g. `http://localhost:8080`)
- `VITE_BUCKET_BASE` — S3 bucket base URL for serving photos (trailing slash expected; photos are served from `{VITE_BUCKET_BASE}small/`, `medium/`, `large/` subdirectories)
- `VITE_GA_ID` — Optional Google Analytics measurement ID

## Architecture

### Frontend Structure

- `src/api/` — API layer. `api.ts` wraps `fetch` with auth headers and base URL. `album-api.ts` contains album/photo CRUD operations. `statistics-api.ts` tracks album views and downloads. `types.ts` holds backend response interfaces.
- `src/auth/` — Login page. Auth token is stored in `localStorage` as `authToken` (JWT). `src/utils/auth.ts` handles JWT expiry checking; expired tokens auto-logout on the next API call.
- `src/collections/` — Collection view: a grid of album cards. `collection.tsx` fetches from `/api/collection?id=` and renders `AlbumGrid` with create/edit/delete modals.
- `src/albums/` — Album view: `album-gallery-wrapper.tsx` → `album-gallery.tsx`. The gallery renders via `react-photo-album` (masonry/rows/columns layout). Photos are displayed in three sizes from S3: `small` (grid thumbnails), `medium` (lightbox), `large` (download).
- `src/pages/` — Top-level page components: `home`, `about`, `collections` (the groups/collections landing).
- `src/hooks/` — Shared hooks: `use-album-operations.ts` wraps react-query mutations for album CRUD; `use-modal-state.ts` manages add/edit modal open state; `use-auto-logout.ts` polls token validity.
- `src/components/` — Shared UI primitives (StyledButton, BackButton, LightboxButton).
- `src/route-table.tsx` — All routes defined here. Also exports `LocationTracker` (sets document title per route, fires GA page views) and `titleMap` (route → page title).

### Data Flow

Collections contain Albums. Albums contain Photos.

- `/albums` → `collection_id="main-collection"`
- `/collections/robotics` → `collection_id="robotics"`
- `/album/:albumId` → individual album gallery

### Auth Pattern

Auth state is checked via `localStorage.getItem('authToken')`. Admin-only UI (upload button, edit/delete controls) is shown only when a valid token exists. The token is passed as a `Bearer` header on all `apiRequest` calls.

### Path Alias

`@src` resolves to `src/` (configured in `vite.config.ts` and tsconfig). Use `@src/...` for cross-directory imports.
