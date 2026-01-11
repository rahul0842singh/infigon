import { ProductDetailsPageClient } from "./ui/ProductDetailsPageClient";

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  return <ProductDetailsPageClient id={params.id} />;
}
