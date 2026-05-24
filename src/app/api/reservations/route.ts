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

import { ZodError } from "zod";

import {
  getIdempotencyEntry,
  createProcessingEntry,
  completeIdempotencyEntry,
  deleteIdempotencyEntry,
} from "@/lib/idempotency";

import {
  hashRequestBody,
} from "@/lib/hash";

import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  let idempotencyKey: string | null =
    null;

  try {
    const body = await req.json();

    const validated =
      createReservationSchema.parse(
        body
      );

    idempotencyKey =
      req.headers.get(
        "Idempotency-Key"
      );

    if (!idempotencyKey) {
      return error(
        "Missing Idempotency-Key header",
        400
      );
    }

    const requestHash =
      hashRequestBody(validated);

    const existing =
      await getIdempotencyEntry(
        idempotencyKey
      );

    if (existing) {
      if (
        existing.requestHash !==
        requestHash
      ) {
        return error(
          "Idempotency key reused with different payload",
          409
        );
      }

      if (
        existing.status ===
        "processing"
      ) {
        return error(
          "Request already in progress",
          409
        );
      }

      return success(
        existing.response,
        existing.statusCode
      );
    }

    const lockCreated =
      await createProcessingEntry(
        idempotencyKey,
        requestHash
      );

    if (!lockCreated) {
      return error(
        "Duplicate request in progress",
        409
      );
    }

    const reservation =
      await createReservation(
        validated.productId,
        validated.warehouseId,
        validated.quantity
      );

    await completeIdempotencyEntry(
      idempotencyKey,
      requestHash,
      reservation,
      201
    );

    return success(
      reservation,
      201
    );
  } catch (err: unknown) {
    console.error(err);

    if (idempotencyKey) {
      const shouldCleanup =
        !(
          err instanceof ConflictError ||
          err instanceof ZodError
        );

      if (shouldCleanup) {
        await deleteIdempotencyEntry(
          idempotencyKey
        );
      }
    }

    if (err instanceof ConflictError) {
      return error(
        err.message,
        409
      );
    }

    if (err instanceof ZodError) {
      return error(
        "Invalid request payload",
        400
      );
    }

    if (
  err instanceof
  Prisma.PrismaClientKnownRequestError
) {
  if (err.code === "P2028") {
    return error(
      "Server busy, please retry",
      503
    );
  }
}

    return error(
      "Failed to create reservation",
      500
    );
  }
}