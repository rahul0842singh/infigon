"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  isActive: boolean;
  onToggle: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  label?: string;
};

export function FavoriteButton({ isActive, onToggle, className, label }: Props) {
  return (
    <button
      type="button"
      onClick={(e) => onToggle(e)}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm font-medium text-black/80 shadow-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-black/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/15 dark:focus:ring-white/20",
        className
      )}
      aria-pressed={isActive}
      aria-label={isActive ? "Remove from favorites" : "Add to favorites"}
      title={isActive ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={cn("h-4 w-4", isActive && "fill-current")} />
      {label ? <span>{label}</span> : null}
    </button>
  );
}
