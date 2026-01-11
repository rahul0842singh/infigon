import type { Product } from "@/types/product";

const API_BASE = "https://fakestoreapi.com";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    // Cache products for a bit; change to `no-store` if you want always-fresh.
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ApiError(
      `Request failed (${res.status})${text ? `: ${text}` : ""}`,
      res.status
    );
  }

  return (await res.json()) as T;
}

export async function getProducts(): Promise<Product[]> {
  return fetchJson<Product[]>(`${API_BASE}/products`);
}

export async function getProduct(id: number): Promise<Product> {
  return fetchJson<Product>(`${API_BASE}/products/${id}`);
}

export { ApiError };
