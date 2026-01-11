"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { formatPrice } from "@/lib/utils";
import {
  Star,
  ShoppingBag,
  Filter,
  Grid3x3,
  List,
  ArrowRight,
  Sparkles,
  Tag,
  TrendingUp,
  Search,
  X,
  RotateCw,
  AlertTriangle,
} from "lucide-react";

type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
  rating?: { rate: number; count: number };
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function ProductsPageClient() {
  // ✅ products fetched on the client
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc" | "rating">(
    "featured"
  );

  const [visible, setVisible] = useState(8);

  const loadProducts = async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("https://fakestoreapi.com/products", {
        // client-side fetch; avoids Vercel server IP restrictions
        cache: "no-store",
        signal,
        headers: { accept: "application/json" },
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText}${txt ? ` — ${txt.slice(0, 120)}` : ""}`);
      }

      const data = (await res.json()) as Product[];

      setProducts(Array.isArray(data) ? data : []);
      setVisible(8);
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      setProducts([]);
      setError(e?.message ?? "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadProducts(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["all", ...Array.from(set)];
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = products.filter((p) => {
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);

      const matchesCategory = category === "all" || p.category === category;
      return matchesQuery && matchesCategory;
    });

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating")
      list = [...list].sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0));

    return list;
  }, [products, query, category, sort]);

  const shown = useMemo(() => filtered.slice(0, visible), [filtered, visible]);
  const canLoadMore = shown.length < filtered.length;

  const avgRating = useMemo(() => {
    const rated = products.filter((p) => typeof p.rating?.rate === "number");
    if (!rated.length) return 4.5;
    const sum = rated.reduce((acc, p) => acc + (p.rating?.rate ?? 0), 0);
    return Math.round((sum / rated.length) * 10) / 10;
  }, [products]);

  const onShopNow = () => {
    const el = document.getElementById("products-section");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setSort("featured");
    setVisible(8);
  };

  return (
    <AppShell
      title="Product Explorer"
      subtitle="Discover premium products from Fake Store API. Built with Next.js 15 & Tailwind CSS."
      right={
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setFiltersOpen((v) => !v)}
          >
            <Filter className="w-4 h-4" />
            Filter
          </Button>

          <div className="flex items-center border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            <button
              type="button"
              aria-label="Grid view"
              onClick={() => setView("grid")}
              className={[
                "p-2 transition-colors",
                view === "grid"
                  ? "bg-gray-50 dark:bg-gray-800"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700",
              ].join(" ")}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>

            <button
              type="button"
              aria-label="List view"
              onClick={() => setView("list")}
              className={[
                "p-2 transition-colors",
                view === "list"
                  ? "bg-gray-50 dark:bg-gray-800"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700",
              ].join(" ")}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      }
    >
      {/* Hero Section */}
      <div className="relative mb-8 sm:mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-600 dark:via-purple-600 dark:to-pink-600">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative px-6 py-8 sm:p-10 lg:p-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="text-sm font-semibold text-white/90">
                Premium Collection
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
              Discover Amazing Products
            </h1>

            <p className="text-lg text-white/90 mb-6">
              Browse our curated collection of premium products with detailed descriptions and secure checkout.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Button className="bg-white text-gray-900 hover:bg-gray-100" onClick={onShopNow}>
                <ShoppingBag className="w-5 h-5 mr-2" />
                Shop Now
              </Button>

              <Button
                variant="ghost"
                className="border border-white/40 text-white hover:bg-white/10"
                onClick={() => setFiltersOpen(true)}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Client fetch status */}
      {loading ? (
        <div className="mb-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
            <RotateCw className="w-4 h-4 animate-spin" />
            Loading products…
          </div>
          <Button
            variant="ghost"
            className="border border-gray-200 dark:border-gray-800"
            onClick={() => loadProducts()}
          >
            Retry
          </Button>
        </div>
      ) : error ? (
        <div className="mb-6 rounded-2xl border border-red-200 dark:border-red-900/40 bg-white/80 dark:bg-gray-900/80 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                Couldn&apos;t load products
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 break-words">
                {error}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <Button
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  onClick={() => loadProducts()}
                >
                  Retry
                </Button>

                <Button
                  variant="ghost"
                  className="border border-gray-200 dark:border-gray-800"
                  onClick={() => {
                    resetFilters();
                    setFiltersOpen(false);
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Stats Bar */}
      <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900 p-4 border border-blue-100 dark:border-blue-900/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Tag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {products.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Products</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-gray-900 p-4 border border-emerald-100 dark:border-emerald-900/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <Star className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {avgRating}+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-900 p-4 border border-purple-100 dark:border-purple-900/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">100%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Quality</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/20 dark:to-gray-900 p-4 border border-amber-100 dark:border-amber-900/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <ShoppingBag className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">24h</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div id="products-section" className="grid gap-6 sm:gap-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Featured Products
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Handpicked selection of premium items
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {shown.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {filtered.length}
              </span>
            </div>

            <Button
              variant="ghost"
              className="sm:hidden inline-flex items-center gap-2"
              onClick={() => setFiltersOpen((v) => !v)}
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>

            <Button
              variant="ghost"
              className="hidden sm:flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              onClick={() => setVisible(8)}
            >
              View Top
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filter Panel */}
        {filtersOpen && (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Filters
              </div>
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setFiltersOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {/* Search */}
              <label className="block">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Search
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setVisible(8);
                    }}
                    placeholder="Search products..."
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              </label>

              {/* Category */}
              <label className="block">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Category
                </div>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setVisible(8);
                  }}
                  className="w-full h-10 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm text-gray-900 dark:text-gray-100 px-3 outline-none focus:ring-2 focus:ring-blue-500/30"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c === "all" ? "All categories" : c}
                    </option>
                  ))}
                </select>
              </label>

              {/* Sort */}
              <label className="block">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Sort
                </div>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value as any);
                    setVisible(8);
                  }}
                  className="w-full h-10 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm text-gray-900 dark:text-gray-100 px-3 outline-none focus:ring-2 focus:ring-blue-500/30"
                >
                  <option value="featured">Featured</option>
                  <option value="rating">Top Rated</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                </select>
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  resetFilters();
                  setFiltersOpen(false);
                }}
                className="border border-gray-200 dark:border-gray-800"
              >
                Reset
              </Button>

              <div className="text-xs text-gray-500 dark:text-gray-400">
                Tip: Search by title, category, or description
              </div>
            </div>
          </div>
        )}

        {/* Empty state (only when NOT loading and no error) */}
        {!loading && !error && filtered.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 p-10 text-center text-sm text-gray-600 dark:text-gray-400">
            No products found. Try adjusting your filters.
          </div>
        ) : null}

        {/* Products Grid/List */}
        <div
          className={
            view === "grid"
              ? "grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid gap-4"
          }
        >
          {shown.map((p) => {
            const premium = p.price > 500;

            if (view === "list") {
              return (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="group overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-[1px] hover:border-gray-300 dark:hover:border-gray-700"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-56 aspect-square sm:aspect-auto sm:h-56 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 224px"
                        className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                        priority={p.id <= 4}
                      />
                      {premium && (
                        <div className="absolute left-4 top-4">
                          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                            <Sparkles className="w-3 h-3" />
                            Premium
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 p-5 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <Badge className="bg-gradient-to-r from-gray-900 to-gray-700 text-white dark:from-gray-700 dark:to-gray-600 text-xs font-medium">
                          {p.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {p.rating?.rate?.toFixed(1) ?? "4.5"}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold leading-tight text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {p.title}
                      </h3>

                      <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                        {p.description}
                      </p>

                      <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-end justify-between gap-4">
                        <div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {formatPrice(p.price)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Free shipping
                          </div>
                        </div>

                        <div className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                          View details <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            }

            // GRID card
            return (
              <Link
                key={p.id}
                href={`/products/${p.id}`}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-gray-300 dark:hover:border-gray-700"
              >
                {premium && (
                  <div className="absolute left-4 top-4 z-10">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                      <Sparkles className="w-3 h-3" />
                      Premium
                    </span>
                  </div>
                )}

                <div className="relative aspect-square w-full bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-contain p-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
                    priority={p.id <= 4}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 shadow-lg">
                        <ShoppingBag className="w-4 h-4" />
                        Quick View
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Badge className="bg-gradient-to-r from-gray-900 to-gray-700 text-white dark:from-gray-700 dark:to-gray-600 text-xs font-medium">
                        {p.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {p.rating?.rate?.toFixed(1) ?? "4.5"}
                        </span>
                      </div>
                    </div>

                    <h3 className="line-clamp-2 text-base font-semibold leading-tight text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {p.title}
                    </h3>

                    <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                      {p.description.substring(0, 80)}...
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {formatPrice(p.price)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Free shipping
                        </div>
                      </div>

                      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 dark:group-hover:border-blue-400/20 rounded-2xl transition-colors duration-300 pointer-events-none" />
              </Link>
            );
          })}
        </div>

        {/* Load More Button */}
        <div className="mt-6 flex flex-col items-center gap-3">
          {canLoadMore ? (
            <Button
              className="group px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => setVisible((v) => clamp(v + 8, 8, filtered.length))}
            >
              <span className="flex items-center gap-2">
                Load More Products
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          ) : (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              You&apos;ve reached the end.
            </div>
          )}

          <div className="text-xs text-gray-500 dark:text-gray-400">
            Showing {shown.length} of {filtered.length}
          </div>

          {(query || category !== "all" || sort !== "featured") && (
            <Button
              variant="ghost"
              className="border border-gray-200 dark:border-gray-800"
              onClick={resetFilters}
            >
              Reset Filters
            </Button>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-800 p-8 sm:p-10">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Can&apos;t find what you&apos;re looking for?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Our product catalog updates daily with new arrivals. Sign up to be the first to know about exclusive
              offers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                Contact Sales
              </Button>
              <Button
                variant="ghost"
                className="border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Sign Up for Updates
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
