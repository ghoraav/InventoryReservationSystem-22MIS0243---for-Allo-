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

  const { addReservation } =
    useReservations();

  async function handleReserve(
    warehouseId: string
  ) {
    try {
      setLoading(true);
      setError(null);

      const created =
        await createReservation({
          productId: product.id,
          warehouseId,
          quantity: 1,
        });

      addReservation(created);
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
          (inventory) => (
            <div
              key={inventory.warehouseId}
              className="border rounded p-3 flex items-center justify-between"
            >
              <div>
                <p className="font-medium">
                  {
                    inventory.warehouseName
                  }
                </p>

                <p className="text-sm text-gray-500">
                  Available Stock:{" "}
                  {
                    inventory.availableStock
                  }
                </p>
              </div>

              <button
                onClick={() =>
                  handleReserve(
                    inventory.warehouseId
                  )
                }
                disabled={
                  loading ||
                  inventory.availableStock <= 0
                }
                className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Reserve
              </button>
            </div>
          )
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