import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <AppShell title="Product Explorer" subtitle="Dashboard">
      <div className="rounded-2xl border border-black/10 bg-white/70 p-10 text-center shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/10">
        <h1 className="text-lg font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <div className="mt-6">
          <Link href="/products">
            <Button>Go to Products</Button>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
