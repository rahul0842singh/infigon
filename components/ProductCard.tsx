import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { Badge } from "@/components/Badge";
import { formatPrice } from "@/lib/utils";

type Props = {
  product: Product;
  trailing?: React.ReactNode;
};

export function ProductCard({ product, trailing }: Props) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white/70 shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-white/10">
      {trailing ? (
        <div className="absolute right-3 top-3 z-10">{trailing}</div>
      ) : null}

      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[4/3] w-full bg-white/60 dark:bg-white/5">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-6 transition duration-300 group-hover:scale-[1.02]"
            priority={false}
          />
        </div>

        <div className="space-y-2 p-4">
          <h3 className="line-clamp-2 text-sm font-semibold text-black/90 dark:text-white">
            {product.title}
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <Badge>{product.category}</Badge>
            <span className="text-sm font-semibold text-black dark:text-white">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
