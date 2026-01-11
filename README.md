# Product Explorer Dashboard

A production-style frontend application built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.  
The app fetches product data from a public API and provides search, category filtering, product details, and a persistent favorites feature.

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**

## API Used

- Fake Store API: https://fakestoreapi.com/products

---

## Features Implemented

### 1) Product Listing Page
- Fetches products from the Fake Store API
- Displays products in a responsive grid layout
- Product card includes:
  - Image
  - Title
  - Price
  - Category
- Handles:
  - Loading state (spinner/skeletons)
  - Error state (fallback UI)

### 2) Search & Filtering
- Client-side search by product title
- Filter by category (dropdown/buttons)
- Favorites-only filter

### 3) Product Details Page
- Dynamic route: `/products/[id]`
- Displays:
  - Large image
  - Title
  - Description
  - Price
  - Category

### 4) Favorites
- Mark/unmark products as favorites
- Favorites persist via `localStorage`
- Filter products to show only favorites

### 5) Responsive Design
- Mobile-first layout
- Usable on:
  - Mobile
  - Tablet
  - Desktop

---


## Getting Started

### 1) Clone the repository
git clone <your-repo-url>
cd <your-repo-folder>

### 2) Install dependencies
npm install

### 3) Run the development server
npm run dev

### 4) Production build (optional)
npm run build
npm run start

## Assumptions / Trade-offs

- Favorites are stored in **localStorage**, which means:
  - Favorites persist only in the same browser/device
  - Favorites state is client-side (requires client components/hooks)

- Search and category filtering are done **client-side** since the API does not provide dedicated endpoints for search/filter.

- Typed models are based on the current **FakeStoreAPI** response format.

