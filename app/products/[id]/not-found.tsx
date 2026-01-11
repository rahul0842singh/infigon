import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <AppShell title="Product Explorer" subtitle="Product not found">
      <div className="rounded-2xl border border-black/10 bg-white/70 p-10 text-center shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/10">
        <h1 className="text-lg font-semibold">Product not found</h1>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          This product doesn&apos;t exist (or the API is temporarily unavailable).
        </p>
        <div className="mt-6">
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
