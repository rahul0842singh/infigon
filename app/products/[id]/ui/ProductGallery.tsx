"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const list = useMemo(() => images.filter(Boolean), [images]);
  const [active, setActive] = useState(0);

  const current = list[active] ?? list[0];

  return (
    <div className="grid gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white/60 dark:bg-white/5">
        <Image
          src={current}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-contain p-8 sm:p-10"
          priority
        />
      </div>

      {list.length > 1 ? (
        <div className="flex gap-3 overflow-auto pb-1">
          {list.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              className={
                "relative h-20 w-20 flex-none overflow-hidden rounded-xl border bg-white/60 transition " +
                (i === active
                  ? "border-black/30 shadow-soft dark:border-white/30"
                  : "border-black/10 hover:border-black/20 dark:border-white/10 dark:hover:border-white/20")
              }
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={src}
                alt={`${title} thumbnail ${i + 1}`}
                fill
                sizes="80px"
                className="object-contain p-2"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
