import { AppShell } from "@/components/AppShell";
import { Skeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <AppShell title="Product Explorer" subtitle="Loading details...">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white/70 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/10">
          <Skeleton className="aspect-square w-full rounded-none" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    </AppShell>
  );
}
