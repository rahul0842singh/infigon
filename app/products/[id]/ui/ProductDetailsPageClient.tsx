"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { FavoriteDetails } from "./FavoriteDetails";
import { ProductGallery } from "./ProductGallery";
import { PurchaseActions } from "./PurchaseActions";
import { DetailsAccordion } from "./DetailsAccordion";
import { formatPrice, safeNumber } from "@/lib/utils";

type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
  rating?: { rate: number; count: number };
};

function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const total = 5;

  return (
    <div className="flex items-center gap-1" aria-label={`Rated ${value} out of 5`}>
      {Array.from({ length: total }).map((_, i) => {
        const isFull = i < full;
        const isHalf = i === full && half;

        return (
          <svg
            key={i}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            className={
              isFull
                ? "fill-black/80 dark:fill-white/80"
                : isHalf
                ? "fill-black/60 dark:fill-white/60"
                : "fill-black/20 dark:fill-white/20"
            }
            aria-hidden="true"
          >
            <path d="M12 17.3l-6.18 3.73 1.64-7.03L2 9.24l7.19-.62L12 2l2.81 6.62 7.19.62-5.46 4.76 1.64 7.03z" />
          </svg>
        );
      })}
    </div>
  );
}

function InfoPill({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-black/10 bg-white/60 p-3 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/5">
      <div className="grid h-10 w-10 place-items-center rounded-xl border border-black/10 bg-white/70 text-base dark:border-white/10 dark:bg-white/10">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium text-black/85 dark:text-white/85">
          {title}
        </div>
        <div className="text-xs leading-relaxed text-black/55 dark:text-white/55">
          {desc}
        </div>
      </div>
    </div>
  );
}

export function ProductDetailsPageClient({ id }: { id: string }) {
  const productId = safeNumber(id);

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (signal?: AbortSignal) => {
    if (!productId) {
      setError("Invalid product id");
      setProduct(null);
      setAllProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [prodRes, listRes] = await Promise.all([
        fetch(`https://fakestoreapi.com/products/${productId}`, {
          signal,
          cache: "no-store",
          headers: { accept: "application/json" },
        }),
        fetch("https://fakestoreapi.com/products", {
          signal,
          cache: "no-store",
          headers: { accept: "application/json" },
        }),
      ]);

      if (!prodRes.ok) {
        const t = await prodRes.text().catch(() => "");
        throw new Error(`Product fetch failed: HTTP ${prodRes.status} ${prodRes.statusText}${t ? ` — ${t.slice(0, 120)}` : ""}`);
      }

      const prod = (await prodRes.json()) as Product;
      setProduct(prod);

      if (listRes.ok) {
        const list = (await listRes.json()) as Product[];
        setAllProducts(Array.isArray(list) ? list : []);
      } else {
        setAllProducts([]);
      }
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      setError(e?.message ?? "Failed to load product");
      setProduct(null);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // ✅ Robust pagination: build a sorted unique numeric ID list
  const { prevId, nextId, position, total } = useMemo(() => {
    const ids = Array.from(
      new Set(
        allProducts
          .map((p) => Number(p.id))
          .filter((x) => Number.isFinite(x) && x > 0)
      )
    ).sort((a, b) => a - b);

    const total = ids.length || 0;

    if (!product?.id || !total) {
      return { prevId: null as number | null, nextId: null as number | null, position: 0, total };
    }

    let idx = ids.indexOf(Number(product.id));
    if (idx === -1) {
      const closest = ids.findIndex((x) => x >= Number(product.id));
      idx = closest === -1 ? 0 : closest;
    }

    const prevId = idx > 0 ? ids[idx - 1] : null;
    const nextId = idx < ids.length - 1 ? ids[idx + 1] : null;

    return { prevId, nextId, position: idx + 1, total };
  }, [allProducts, product]);

  const ratingValue = product?.rating?.rate ?? 0;
  const ratingCount = product?.rating?.count ?? 0;

  return (
    <AppShell
      title="Product Explorer"
      subtitle="Product details"
      right={
        <Link href="/products">
          <Button variant="ghost" size="sm">
            ← Back
          </Button>
        </Link>
      }
    >
      {/* Loading / Error / Not found */}
      {loading ? (
        <div className="rounded-3xl border border-black/10 bg-white/70 p-6 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/10">
          <div className="text-sm text-black/70 dark:text-white/70">Loading product…</div>
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-500/20 bg-white/70 p-6 shadow-soft backdrop-blur dark:border-red-500/20 dark:bg-white/10">
          <div className="text-sm font-semibold text-black/85 dark:text-white/85">
            Couldn&apos;t load product
          </div>
          <div className="mt-2 text-sm text-black/60 dark:text-white/60 break-words">
            {error}
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => fetchData()}>Retry</Button>
            <Link href="/products">
              <Button variant="ghost">Back to products</Button>
            </Link>
          </div>
        </div>
      ) : !product ? (
        <div className="rounded-3xl border border-black/10 bg-white/70 p-6 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/10">
          <div className="text-sm font-semibold text-black/85 dark:text-white/85">
            Product not found
          </div>
          <div className="mt-4">
            <Link href="/products">
              <Button variant="ghost">Back to products</Button>
            </Link>
          </div>
        </div>
      ) : (
        // ✅ Your original UI (unchanged, now driven by client-fetched product)
        <div className="relative">
          <div className="pointer-events-none absolute inset-x-0 -top-12 h-52 bg-gradient-to-b from-black/[0.05] to-transparent dark:from-white/[0.06]" />

          <div className="mx-auto w-full max-w-6xl space-y-6 px-0">
            {/* Breadcrumbs */}
            <nav className="flex flex-wrap items-center gap-2 text-xs text-black/55 dark:text-white/55">
              <Link href="/products" className="hover:text-black dark:hover:text-white">
                Home
              </Link>
              <span className="text-black/25 dark:text-white/25">/</span>
              <Link href="/products" className="hover:text-black dark:hover:text-white">
                Products
              </Link>
              <span className="text-black/25 dark:text-white/25">/</span>
              <span className="max-w-[45ch] truncate text-black/80 dark:text-white/80">
                {product.title}
              </span>
            </nav>

            {/* Pagination bar */}
            <div className="rounded-3xl border border-black/10 bg-white/70 p-3 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/10 sm:p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-black/60 dark:text-white/60">
                  Product{" "}
                  <span className="font-semibold text-black/80 dark:text-white/80">
                    {position || 1}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-black/80 dark:text-white/80">
                    {total || "—"}
                  </span>
                </div>

                <div className="flex gap-2">
                  {prevId ? (
                    <Link href={`/products/${prevId}`}>
                      <Button variant="ghost" size="sm">
                        ← Previous
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="ghost" size="sm" disabled>
                      ← Previous
                    </Button>
                  )}

                  {nextId ? (
                    <Link href={`/products/${nextId}`}>
                      <Button variant="ghost" size="sm">
                        Next →
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="ghost" size="sm" disabled>
                      Next →
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
              {/* IMAGE FIRST on mobile */}
              <div className="order-1 lg:order-1 lg:col-span-7 space-y-6">
                <section className="rounded-3xl border border-black/10 bg-white/70 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/10">
                  <div className="p-4 sm:p-6">
                    <ProductGallery title={product.title} images={[product.image]} />
                  </div>
                </section>

                <section className="rounded-3xl border border-black/10 bg-white/70 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/10">
                  <div className="p-5 sm:p-6">
                    <h2 className="text-sm font-semibold text-black/80 dark:text-white/80">
                      About this product
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-black/70 dark:text-white/70">
                      {product.description}
                    </p>
                  </div>
                </section>

                <DetailsAccordion description={product.description} />
              </div>

              {/* DETAILS AFTER image on mobile */}
              <aside className="order-2 lg:order-2 lg:col-span-5">
                <div className="lg:sticky lg:top-6">
                  <section className="rounded-3xl border border-black/10 bg-white/70 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/10">
                    <div className="p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge>{product.category}</Badge>
                            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                              In stock
                            </span>
                          </div>

                          <h1 className="text-balance text-xl font-semibold tracking-tight text-black/90 dark:text-white/90 sm:text-2xl">
                            {product.title}
                          </h1>

                          <div className="flex flex-wrap items-center gap-2 text-sm text-black/70 dark:text-white/70">
                            <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3 py-1 dark:border-white/10 dark:bg-white/5">
                              <Stars value={ratingValue} />
                              <span className="font-medium">
                                {ratingValue ? ratingValue.toFixed(1) : "0.0"}
                              </span>
                            </div>
                            <span className="text-black/45 dark:text-white/45">
                              {ratingCount} reviews
                            </span>
                          </div>
                        </div>

                        <FavoriteDetails productId={product.id} />
                      </div>

                      <div className="mt-5 rounded-2xl border border-black/10 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
                        <div className="flex items-end justify-between gap-4">
                          <div className="space-y-1">
                            <div className="text-2xl font-semibold tracking-tight text-black dark:text-white sm:text-3xl">
                              {formatPrice(product.price)}
                            </div>
                            <div className="text-xs text-black/50 dark:text-white/50">
                              Inclusive of all taxes (demo text)
                            </div>
                          </div>

                          <div className="hidden sm:flex flex-col items-end text-xs text-black/55 dark:text-white/55">
                            <span>Secure checkout</span>
                            <span>Fast support</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <PurchaseActions
                          productId={product.id}
                          price={product.price}
                          title={product.title}
                        />
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <InfoPill icon="🚚" title="Fast delivery" desc="2–5 business days (demo)" />
                        <InfoPill icon="↩️" title="Easy returns" desc="Hassle-free returns (demo)" />
                        <InfoPill icon="🔒" title="Secure payments" desc="SSL protected checkout" />
                        <InfoPill icon="💬" title="24×7 support" desc="Chat / Email support" />
                      </div>

                      <div className="mt-6 flex flex-wrap gap-2">
                        <Link href="/products">
                          <Button variant="ghost">Browse more</Button>
                        </Link>
                        <a
                          href="https://fakestoreapi.com/"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex"
                        >
                          <Button variant="ghost">API Source</Button>
                        </a>
                      </div>
                    </div>
                  </section>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
