"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { formatPrice } from "@/lib/utils";

export function PurchaseActions({
  productId,
  title,
  price,
}: {
  productId: number;
  title: string;
  price: number;
}) {
  const [qty, setQty] = useState(1);

  const subtotal = useMemo(() => price * qty, [price, qty]);

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white/60 p-3 dark:border-white/10 dark:bg-white/5">
        <div className="text-sm text-black/70 dark:text-white/70">
          Quantity
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="h-9 w-9 rounded-xl border border-black/10 bg-white/70 text-black/80 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-white/10 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/15 dark:focus:ring-white/10"
            onClick={() => setQty((v) => Math.max(1, v - 1))}
            aria-label="Decrease quantity"
          >
            −
          </button>

          <input
            value={qty}
            onChange={(e) => {
              const next = Number(e.target.value);
              if (!Number.isFinite(next)) return;
              setQty(Math.max(1, Math.min(99, next)));
            }}
            inputMode="numeric"
            className="h-9 w-14 rounded-xl border border-black/10 bg-white/70 text-center text-sm text-black/80 outline-none focus:ring-2 focus:ring-black/10 dark:border-white/10 dark:bg-white/10 dark:text-white/80 dark:focus:ring-white/10"
            aria-label="Quantity"
          />

          <button
            type="button"
            className="h-9 w-9 rounded-xl border border-black/10 bg-white/70 text-black/80 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-white/10 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/15 dark:focus:ring-white/10"
            onClick={() => setQty((v) => Math.min(99, v + 1))}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Button
          onClick={() => {
            // Hook this up to your cart/store.
            // Keeping it as a no-op (besides a log) so the project stays self-contained.
            console.log("Add to cart", { productId, qty, title, price });
          }}
        >
          Add to cart
        </Button>

        <Button
          variant="ghost"
          onClick={() => {
            // Hook this up to your checkout flow.
            console.log("Buy now", { productId, qty, title, price });
          }}
        >
          Buy now • {formatPrice(subtotal)}
        </Button>
      </div>
    </div>
  );
}
