"use client";

import * as React from "react";
import type { Product } from "@/types/product";
import { ProductCard } from "@/components/ProductCard";
import { FavoriteButton } from "@/components/FavoriteButton";
import { Button } from "@/components/Button";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

type SortMode = "relevance" | "price-asc" | "price-desc";

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export function ProductExplorer({ products }: { products: Product[] }) {
  const { favoriteSet, isFavorite, toggle, clear } = useFavorites();

  const categories = React.useMemo(() => {
    const uniq = new Set<string>();
    for (const p of products) uniq.add(p.category);
    return ["All", ...Array.from(uniq).sort((a, b) => a.localeCompare(b))];
  }, [products]);

  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebouncedValue(query, 200);
  const [category, setCategory] = React.useState<string>("All");
  const [favoritesOnly, setFavoritesOnly] = React.useState(false);
  const [sort, setSort] = React.useState<SortMode>("relevance");

  const filtered = React.useMemo(() => {
    const q = normalize(debouncedQuery);

    let list = products.filter((p) => {
      const inCategory = category === "All" ? true : p.category === category;
      const matches = q.length === 0 ? true : normalize(p.title).includes(q);
      const favOk = favoritesOnly ? favoriteSet.has(p.id) : true;
      return inCategory && matches && favOk;
    });

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);

    return list;
  }, [products, category, debouncedQuery, favoritesOnly, favoriteSet, sort]);

  const hasAnyFavorites = favoriteSet.size > 0;

  return (
    <div className="space-y-5">
      {/* Controls */}
      <section className="rounded-2xl border border-black/10 bg-white/70 p-4 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/10">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1 space-y-2">
            <div className="text-sm font-semibold text-black/90 dark:text-white">
              Explore products
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/50 dark:text-white/50" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title..."
                className={cn(
                  "w-full rounded-xl border border-black/10 bg-white/70 py-2 pl-10 pr-10 text-sm outline-none transition placeholder:text-black/40 focus:border-black/20 focus:ring-2 focus:ring-black/10 dark:border-white/10 dark:bg-white/10 dark:placeholder:text-white/40 dark:focus:border-white/20 dark:focus:ring-white/10"
                )}
                aria-label="Search products by title"
              />
              {query ? (
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:flex lg:flex-wrap lg:justify-end">
            <div className="col-span-2 sm:col-span-2">
              <label className="block text-xs font-medium text-black/60 dark:text-white/60">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-black/10 bg-white/70 px-3 text-sm outline-none focus:ring-2 focus:ring-black/10 dark:border-white/10 dark:bg-white/10 dark:focus:ring-white/10"
                aria-label="Filter by category"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-black/60 dark:text-white/60">
                Sort
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortMode)}
                className="mt-1 h-10 w-full rounded-xl border border-black/10 bg-white/70 px-3 text-sm outline-none focus:ring-2 focus:ring-black/10 dark:border-white/10 dark:bg-white/10 dark:focus:ring-white/10"
                aria-label="Sort products"
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <label className="block text-xs font-medium text-black/60 dark:text-white/60">
                Favorites
              </label>
              <button
                type="button"
                onClick={() => setFavoritesOnly((v) => !v)}
                className={cn(
                  "mt-1 h-10 rounded-xl border px-3 text-sm font-medium transition",
                  favoritesOnly
                    ? "border-black/20 bg-black text-white dark:border-white/20 dark:bg-white dark:text-black"
                    : "border-black/10 bg-white/70 text-black hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                )}
                aria-pressed={favoritesOnly}
                aria-label="Toggle favorites only"
              >
                {favoritesOnly ? "Showing ★" : "All + ★"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-black/60 dark:text-white/60">
          <div>
            Showing <span className="font-semibold text-black/80 dark:text-white/80">{filtered.length}</span>{" "}
            of <span className="font-semibold text-black/80 dark:text-white/80">{products.length}</span> products
            {favoritesOnly ? (
              <span>
                {" "}• Favorites: <span className="font-semibold text-black/80 dark:text-white/80">{favoriteSet.size}</span>
              </span>
            ) : null}
          </div>

          {hasAnyFavorites ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clear()}
              aria-label="Clear all favorites"
              title="Clear all favorites"
            >
              Clear favorites
            </Button>
          ) : null}
        </div>
      </section>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <section className="rounded-2xl border border-black/10 bg-white/60 p-10 text-center shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/10">
          <div className="mx-auto max-w-md space-y-2">
            <div className="text-base font-semibold">No products found</div>
            <div className="text-sm text-black/60 dark:text-white/60">
              Try a different search, pick another category, or disable “Favorites only”.
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Button variant="ghost" onClick={() => setQuery("")}>
                Clear search
              </Button>
              <Button variant="ghost" onClick={() => setCategory("All")}>
                Reset category
              </Button>
              <Button variant="ghost" onClick={() => setFavoritesOnly(false)}>
                Show all
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      {/* Grid */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            trailing={
              <FavoriteButton
                isActive={isFavorite(p.id)}
                onToggle={() => toggle(p.id)}
                className="px-2 py-2"
                label=""
              />
            }
          />
        ))}
      </section>

      {/* Little hint */}
      {!hasAnyFavorites ? (
        <div className="text-center text-xs text-black/50 dark:text-white/50">
          Tip: mark products as ★ favorites — they&apos;ll persist even after refresh.
        </div>
      ) : null}
    </div>
  );
}
