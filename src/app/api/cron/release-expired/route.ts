import {
  releaseExpiredReservations,
} from "@/server/services/reservation.service";

import {
  success,
  error,
} from "@/lib/api-response";

export async function GET() {
  try {
    const result =
      await releaseExpiredReservations();

    return success(result);
  } catch (err) {
    console.error(err);

    return error(
      "Failed to release expired reservations",
      500
    );
  }
}