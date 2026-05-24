import ProductCard from "@/components/product-card";

import {
  fetchProducts,
} from "@/lib/api";

export default async function Home() {
  const products =
    await fetchProducts();

  return (
    <main className="max-w-5xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          Inventory Reservation System
        </h1>

        <p className="text-gray-500 mt-2">
          Concurrency-safe ecommerce inventory reservation
        </p>
      </div>

      <div className="grid gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </main>
  );
}