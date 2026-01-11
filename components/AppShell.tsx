import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/Badge";

export function AppShell({
  title,
  subtitle,
  children,
  right,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-black dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 dark:text-white">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-zinc-950/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/products" className="group">
              <div className="flex items-baseline gap-2">
                <span className="text-base font-semibold tracking-tight">
                  {title}
                </span>
                <Badge className="hidden sm:inline-flex">Next.js</Badge>
              </div>
              {subtitle ? (
                <div className="text-xs text-black/60 dark:text-white/60">
                  {subtitle}
                </div>
              ) : null}
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {right}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">{children}</main>

      <footer className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <div className="mt-10 border-t border-black/10 pt-6 text-xs text-black/60 dark:border-white/10 dark:text-white/60">
          Data from Fake Store API. UI built with Next.js App Router + Tailwind.
        </div>
      </footer>
    </div>
  );
}
