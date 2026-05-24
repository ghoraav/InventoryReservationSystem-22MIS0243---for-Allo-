import {
  confirmReservation,
} from "@/server/services/reservation.service";

import {
  GoneError,
} from "@/lib/errors";

import {
  success,
  error,
} from "@/lib/api-response";

export async function POST(
  req: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const reservation =
      await confirmReservation(id);

    return success(reservation);
  } catch (err: unknown) {
    console.error(err);

    if (err instanceof GoneError) {
      return error(err.message, 410);
    }

    return error(
      "Failed to confirm reservation",
      500
    );
  }
}