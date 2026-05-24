"use client";

import {
  useReservations,
} from "@/hooks/use-reservations";

import {
  useProducts,
} from "@/hooks/use-products";

import {
  confirmReservation,
  releaseReservation,
} from "@/lib/api";

import ReservationCountdown
  from "@/components/reservation-countdown";

import { toast } from "sonner";

export default function ReservationSidebar() {
  const {
    reservations,
    removeReservation,
    clearReservations,
  } = useReservations();

  const { refreshProducts } =
    useProducts();

  async function handleConfirm(
    id: string
  ) {
    try {
      await confirmReservation(id);

      removeReservation(id);

      await refreshProducts();

      toast.success(
        "Reservation confirmed"
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    }
  }

  async function handleCancel(
    id: string
  ) {
    try {
      await releaseReservation(id);

      removeReservation(id);

      await refreshProducts();

      toast.success(
        "Reservation released"
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    }
  }

  const totalReservedQuantity =
    reservations.reduce(
      (sum, reservation) =>
        sum + reservation.quantity,
      0
    );

  return (
    <aside className="border border-zinc-800 bg-zinc-950 rounded-xl p-5 space-y-5 xl:sticky xl:top-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">
          Active Reservations
        </h2>

        <p className="text-sm text-zinc-400">
          Manage reserved inventory
        </p>
      </div>

      <div className="border border-zinc-800 rounded-lg p-4 bg-black space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">
            Active Reservations
          </span>

          <span className="font-semibold">
            {reservations.length}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">
            Reserved Quantity
          </span>

          <span className="font-semibold">
            {
              totalReservedQuantity
            }
          </span>
        </div>
      </div>

      {reservations.length > 0 && (
        <button
          onClick={() =>
            clearReservations()
          }
          className="w-full border border-zinc-700 hover:border-zinc-500 rounded-lg px-4 py-3 text-sm transition"
        >
          Clear Local Reservations
        </button>
      )}

      {reservations.length === 0 && (
        <div className="border border-zinc-800 rounded-lg p-6 text-center text-sm text-zinc-500 bg-black">
          No active reservations
        </div>
      )}

      <div className="space-y-4">
        {reservations.map(
          (reservation) => (
            <div
              key={reservation.id}
              className="border border-zinc-800 rounded-xl p-4 space-y-4 bg-black"
            >
              <div className="space-y-1">
                <p className="text-lg font-semibold">
                  {reservation.productName}
                </p>

                <p className="text-sm text-zinc-400">
                  {reservation.warehouseName}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm">
                  Quantity:
                  {" "}
                  {
                    reservation.quantity
                  }
                </p>

                <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                  {reservation.status}
                </span>
              </div>

              <ReservationCountdown
                expiresAt={
                  reservation.expiresAt
                }
                onExpire={() =>
                  removeReservation(
                    reservation.id
                  )
                }
              />

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    handleConfirm(
                      reservation.id
                    )
                  }
                  className="bg-green-600 hover:bg-green-700 transition text-white px-3 py-2 rounded-lg text-sm"
                >
                  Confirm
                </button>

                <button
                  onClick={() =>
                    handleCancel(
                      reservation.id
                    )
                  }
                  className="bg-red-600 hover:bg-red-700 transition text-white px-3 py-2 rounded-lg text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </aside>
  );
}