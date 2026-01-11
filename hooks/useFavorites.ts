"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "product-explorer:favorites";

function readIds(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((x) => (typeof x === "number" ? x : Number(x)))
      .filter((n) => Number.isFinite(n));
  } catch {
    return [];
  }
}

function writeIds(ids: number[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function useFavorites() {
  const [ids, setIds] = useState<number[]>(() => readIds());

  // Sync if changed in another tab
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setIds(readIds());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const set = useMemo(() => new Set(ids), [ids]);

  const isFavorite = useCallback((id: number) => set.has(id), [set]);

  const toggle = useCallback((id: number) => {
    setIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      writeIds(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    writeIds([]);
    setIds([]);
  }, []);

  return { favoriteIds: ids, favoriteSet: set, isFavorite, toggle, clear };
}
