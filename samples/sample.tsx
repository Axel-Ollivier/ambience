interface Product {
  id: number;
  title: string;
  price: number;
  inStock: boolean;
}

const ENDPOINT = "https://api.example.com/products";

// Fetch the in-stock products matching a search query.
export async function searchProducts(query: string): Promise<Product[]> {
  const res = await fetch(`${ENDPOINT}?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  const items: Product[] = await res.json();
  return items.filter((p) => p.inStock);
}
