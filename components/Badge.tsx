import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-black/10 bg-white/70 px-2.5 py-1 text-xs font-medium text-black/80 backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-white/80",
        className
      )}
    >
      {children}
    </span>
  );
}
