"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // You can pipe this to an error reporting service in real apps.
    console.error(error);
  }, [error]);

  return (
    <AppShell title="Product Explorer" subtitle="Dashboard">
      <div className="rounded-2xl border border-black/10 bg-white/70 p-10 text-center shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/10">
        <h1 className="text-lg font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          {error.message}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button onClick={reset}>Try again</Button>
          <Link href="/products">
            <Button variant="ghost">Back to Products</Button>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
