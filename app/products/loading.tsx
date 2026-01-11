import { AppShell } from "@/components/AppShell";
import { ProductCardSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <AppShell title="Product Explorer" subtitle="Loading products...">
      <div className="space-y-5">
        <div className="rounded-2xl border border-black/10 bg-white/70 p-4 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/10">
          <div className="h-4 w-40 animate-pulse rounded bg-black/10 dark:bg-white/10" />
          <div className="mt-3 h-10 w-full animate-pulse rounded-xl bg-black/10 dark:bg-white/10" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
