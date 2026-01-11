export function DetailsAccordion({ description }: { description: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/60 dark:border-white/10 dark:bg-white/5">
      <div className="divide-y divide-black/10 dark:divide-white/10">
        <details className="group p-4" open>
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-black/80 dark:text-white/80">
            Description
            <span className="text-black/40 transition group-open:rotate-180 dark:text-white/40">
              ▾
            </span>
          </summary>

          <p className="mt-3 text-sm leading-relaxed text-black/70 dark:text-white/70">
            {description}
          </p>
        </details>

        <details className="group p-4">
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-black/80 dark:text-white/80">
            Shipping
            <span className="text-black/40 transition group-open:rotate-180 dark:text-white/40">
              ▾
            </span>
          </summary>
          <div className="mt-3 text-sm leading-relaxed text-black/70 dark:text-white/70">
            Standard shipping, tracking included. Replace with your real shipping
            policy.
          </div>
        </details>

        <details className="group p-4">
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-black/80 dark:text-white/80">
            Returns
            <span className="text-black/40 transition group-open:rotate-180 dark:text-white/40">
              ▾
            </span>
          </summary>
          <div className="mt-3 text-sm leading-relaxed text-black/70 dark:text-white/70">
            Easy returns within your policy window. Replace with your real
            returns policy.
          </div>
        </details>
      </div>
    </div>
  );
}
