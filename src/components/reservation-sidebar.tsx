"use client";
import { toast } from "sonner";
import {
  useReservations,
} from "@/hooks/use-reservations";

import ReservationCountdown
  from "@/components/reservation-countdown";

import {
  confirmReservation,
  releaseReservation,
} from "@/lib/api";

import {
  useProducts,
} from "@/hooks/use-products";

export default function ReservationSidebar() {
  const {
    reservations,
    removeReservation,
  } = useReservations();
  const { refreshProducts } =
  useProducts();

  async function handleConfirm(
    id: string
  ) {
    try {
      await confirmReservation(id);

      removeReservation(id);

      toast.success(
  "Reservation confirmed"
);
    } catch (err) {
      console.error(err);
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

  return (
    <aside className="border rounded-lg p-4 space-y-4 h-fit sticky top-8">
      <h2 className="text-xl font-bold">
        Active Reservations
      </h2>

      {reservations.length === 0 && (
        <p className="text-sm text-gray-500">
          No active reservations
        </p>
      )}

      {reservations.map((reservation) => (
        <div
          key={reservation.id}
          className="border rounded p-3 space-y-2"
        >
          <p className="text-sm break-all">
            {reservation.id}
          </p>

          <p className="text-sm">
            Quantity: {reservation.quantity}
          </p>

          <ReservationCountdown
            expiresAt={reservation.expiresAt}
            onExpire={() =>
              removeReservation(
                reservation.id
              )
            }
          />

          <div className="flex gap-2">
            <button
              onClick={() =>
                handleConfirm(
                  reservation.id
                )
              }
              className="bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              Confirm
            </button>

            <button
              onClick={() =>
                handleCancel(
                  reservation.id
                )
              }
              className="bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ))}
    </aside>
  );
}