"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <AppShell title="Product Explorer" subtitle="Error">
      <div className="rounded-2xl border border-black/10 bg-white/70 p-10 text-center shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/10">
        <h1 className="text-lg font-semibold">Couldn&apos;t load products</h1>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          {error.message}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button onClick={reset}>Retry</Button>
          <Link href="/">
            <Button variant="ghost">Home</Button>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
