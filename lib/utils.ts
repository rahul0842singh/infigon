import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function safeNumber(value: string | string[] | undefined): number | null {
  if (!value || Array.isArray(value)) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}
