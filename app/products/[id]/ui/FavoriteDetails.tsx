"use client";

import { FavoriteButton } from "@/components/FavoriteButton";
import { useFavorites } from "@/hooks/useFavorites";

export function FavoriteDetails({ productId }: { productId: number }) {
  const { isFavorite, toggle } = useFavorites();

  return (
    <FavoriteButton
      isActive={isFavorite(productId)}
      onToggle={() => toggle(productId)}
      label={isFavorite(productId) ? "Favorited" : "Favorite"}
      className="self-start"
    />
  );
}
