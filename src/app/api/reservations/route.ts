import {
  createReservation,
} from "@/server/services/reservation.service";

import {
  createReservationSchema,
} from "@/validations/reservation";

import {
  ConflictError,
} from "@/lib/errors";

import {
  success,
  error,
} from "@/lib/api-response";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validated =
      createReservationSchema.parse(body);

    const reservation =
      await createReservation(
        validated.productId,
        validated.warehouseId,
        validated.quantity
      );

    return success(reservation, 201);
  } catch (err: unknown) {
    console.error(err);

    if (err instanceof ConflictError) {
      return error(err.message, 409);
    }

    return error("Failed to create reservation", 500);
  }
}