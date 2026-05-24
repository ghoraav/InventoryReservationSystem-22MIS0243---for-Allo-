"use client";

import { useState } from "react";

import {
  Product,
} from "@/types/product";

import {
  createReservation,
} from "@/lib/api";

import {
  useReservations,
} from "@/hooks/use-reservations";

import {
  useProducts,
} from "@/hooks/use-products";

interface Props {
  product: Product;
}

export default function ProductCard({
  product,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [quantities, setQuantities] =
    useState<
      Record<string, number>
    >({});

  const { addReservation } =
    useReservations();

  const { refreshProducts } =
    useProducts();

  function getQuantity(
    warehouseId: string
  ) {
    return (
      quantities[warehouseId] || 1
    );
  }

  function updateQuantity(
    warehouseId: string,
    value: number
  ) {
    setQuantities((prev) => ({
      ...prev,
      [warehouseId]: value,
    }));
  }

  async function handleReserve(
    warehouseId: string
  ) {
    const quantity =
      getQuantity(warehouseId);

    try {
      setLoading(true);
      setError(null);

      if (quantity <= 0) {
        setError(
          "Quantity must be greater than 0"
        );

        return;
      }

      const inventory =
        product.inventories.find(
          (i) =>
            i.warehouseId ===
            warehouseId
        );

      if (!inventory) {
        setError(
          "Inventory not found"
        );

        return;
      }

      const availableStock =
        inventory.totalStock -
        inventory.reservedStock;

      if (
        quantity > availableStock
      ) {
        setError(
          "Requested quantity exceeds available stock"
        );

        return;
      }

      const created =
        await createReservation({
          productId: product.id,
          warehouseId,
          quantity,
        });

      addReservation({
        ...created,

        productName:
          product.name,

        warehouseName:
          inventory.warehouseName,
      });

      await refreshProducts();

      updateQuantity(
        warehouseId,
        1
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div>
        <h2 className="text-xl font-bold">
          {product.name}
        </h2>

        <p className="text-gray-500">
          {product.description}
        </p>
      </div>

      <div className="space-y-2">
        {product.inventories.map(
          (inventory) => {
            const quantity =
              getQuantity(
                inventory.warehouseId
              );

            const availableStock =
              inventory.totalStock -
              inventory.reservedStock;

            return (
              <div
                key={
                  inventory.warehouseId
                }
                className="border rounded p-3 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {
                        inventory.warehouseName
                      }
                    </p>

                    <p className="text-sm text-gray-500">
                      Available Stock:{" "}
                      {
                        availableStock
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    max={
                      availableStock
                    }
                    value={quantity}
                    onChange={(e) =>
                      updateQuantity(
                        inventory.warehouseId,
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className="border rounded px-3 py-2 w-24"
                  />

                  <button
                    onClick={() =>
                      handleReserve(
                        inventory.warehouseId
                      )
                    }
                    disabled={
                      loading ||
                      availableStock <=
                        0 ||
                      quantity <= 0 ||
                      quantity >
                        availableStock
                    }
                    className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
                  >
                    Reserve
                  </button>
                </div>
              </div>
            );
          }
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm">
          {error}
        </p>
      )}
    </div>
  );
}