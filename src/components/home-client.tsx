"use client";

import { useState } from "react";

import ProductCard
  from "@/components/product-card";

import ReservationSidebar
  from "@/components/reservation-sidebar";

import ProductSearch
  from "@/components/product-search";

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

  const [search, setSearch] =
    useState("");

  const [
    showAvailableOnly,
    setShowAvailableOnly,
  ] = useState(false);

  const [
    showLowStockOnly,
    setShowLowStockOnly,
  ] = useState(false);

  const filteredProducts =
    products.filter((product) => {
      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const hasAvailableStock =
        product.inventories.some(
          (inventory) =>
            inventory.availableStock > 0
        );

      const hasLowStock =
        product.inventories.some(
          (inventory) =>
            inventory.availableStock > 0 &&
            inventory.availableStock <= 5
        );

      if (
        showAvailableOnly &&
        !hasAvailableStock
      ) {
        return false;
      }

      if (
        showLowStockOnly &&
        !hasLowStock
      ) {
        return false;
      }

      return matchesSearch;
    });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            Inventory Reservation System
          </h1>

          <p className="text-gray-400 text-lg">
            Concurrency-safe ecommerce
            inventory reservation
          </p>
        </div>

        <ProductSearch
          search={search}
          setSearch={setSearch}
          showAvailableOnly={
            showAvailableOnly
          }
          setShowAvailableOnly={
            setShowAvailableOnly
          }
          showLowStockOnly={
            showLowStockOnly
          }
          setShowLowStockOnly={
            setShowLowStockOnly
          }
        />

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-6 items-start">
          <div className="space-y-6">
            {filteredProducts.length ===
              0 && (
              <div className="border border-zinc-800 rounded-xl p-8 text-center text-zinc-400 bg-zinc-950">
                No products found
              </div>
            )}

            {filteredProducts.map(
              (product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              )
            )}
          </div>

          <ReservationSidebar />
        </div>
      </div>
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