import ProductCard from "@/components/product-card";
import ReservationSidebar from "@/components/reservation-sidebar";

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

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3 grid gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

      <ReservationSidebar />
    </div>
  </main>
);
}