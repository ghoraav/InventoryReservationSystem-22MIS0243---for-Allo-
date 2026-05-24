import HomeClient
  from "@/components/home-client";

import {
  fetchProducts,
} from "@/lib/api";

export default async function Home() {
  const products =
    await fetchProducts();

  return (
    <main className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Inventory Reservation System
        </h1>

        <p className="text-gray-500 mt-2">
          Concurrency-safe ecommerce inventory reservation
        </p>
      </div>

      <HomeClient
        products={products}
      />
    </main>
  );
}