# Product Explorer Dashboard

A small production-style frontend built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

## Features

- Product listing (responsive grid) from Fake Store API
- Loading skeletons + route-level error handling
- Client-side search by title
- Category filter
- Favorites: mark/unmark, persisted to `localStorage`
- Favorites-only view
- (Bonus) Sorting by price
- (Bonus) Dark mode toggle (persisted)

## Tech

- Next.js (App Router)
- TypeScript (fully typed API responses + props)
- Tailwind CSS
- Local state + a small `useFavorites` hook (with `storage` sync across tabs)

## Getting Started

### Prerequisites
- Node.js 18+ (recommended)

### Install
```bash
npm install
```

### Run locally
```bash
npm run dev
```

Open `http://localhost:3000`.

### Build
```bash
npm run build
npm run start
```

## Assumptions / Trade-offs

- Fake Store API returns a small dataset (≈20 products), so client-side filtering is fine.
- Favorites are stored as an array of product IDs in localStorage.
- Server Components are used for fetching product data (listing + details). Interactive UI (filters, favorites) is handled in Client Components.

## Folder Structure

- `app/` — routes (App Router), loading + error UI
- `components/` — reusable UI components
- `hooks/` — custom hooks (favorites, debounce)
- `lib/` — API client + utilities
- `types/` — shared TypeScript types

## API

- `https://fakestoreapi.com/products`
- `https://fakestoreapi.com/products/:id`
