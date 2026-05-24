"use client";

import ProductCard
  from "@/components/product-card";

import ReservationSidebar
  from "@/components/reservation-sidebar";

import {
  Product,
} from "@/types/product";

import {
  ProductsProvider,
  useProducts,
} from "@/hooks/use-products";

function HomeContent() {
  const { products } =
    useProducts();

  return (
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
  );
}

export default function HomeClient({
  products,
}: {
  products: Product[];
}) {
  return (
    <ProductsProvider
      initialProducts={products}
    >
      <HomeContent />
    </ProductsProvider>
  );
}