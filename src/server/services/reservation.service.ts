import { prisma } from "@/lib/prisma";
import { ConflictError, GoneError } from "@/lib/errors";
import { ReservationStatus } from "@prisma/client";

const RESERVATION_DURATION_MINUTES = 10;

export async function createReservation(
  productId: string,
  warehouseId: string,
  quantity: number
) {
  return prisma.$transaction(async (tx) => {
    const inventoryRows = await tx.$queryRaw<
      {
        id: string;
        totalStock: number;
        reservedStock: number;
      }[]
    >`
      SELECT id, "totalStock", "reservedStock"
      FROM "Inventory"
      WHERE "productId" = ${productId}
      AND "warehouseId" = ${warehouseId}
      FOR UPDATE
    `;

    const inventory = inventoryRows[0];

    if (!inventory) {
      throw new ConflictError("Inventory not found");
    }

    const availableStock =
      inventory.totalStock - inventory.reservedStock;

    if (availableStock < quantity) {
      throw new ConflictError(
        "Not enough stock available"
      );
    }

    await tx.inventory.update({
      where: {
        id: inventory.id,
      },
      data: {
        reservedStock: {
          increment: quantity,
        },
      },
    });

    const expiresAt = new Date(
      Date.now() +
        RESERVATION_DURATION_MINUTES * 60 * 1000
    );

    const reservation = await tx.reservation.create({
      data: {
        productId,
        warehouseId,
        quantity,
        expiresAt,
        status: ReservationStatus.PENDING,
      },
    });

    return reservation;
  });
}

export async function confirmReservation(
  reservationId: string
) {
  return prisma.$transaction(async (tx) => {
    const reservation = await tx.reservation.findUnique({
      where: {
        id: reservationId,
      },
    });

    if (!reservation) {
      throw new GoneError("Reservation not found");
    }

    if (reservation.status !== ReservationStatus.PENDING) {
      throw new GoneError(
        "Reservation is no longer active"
      );
    }

    if (reservation.expiresAt < new Date()) {
      throw new GoneError(
        "Reservation has expired"
      );
    }

    const inventoryRows = await tx.$queryRaw<
      {
        id: string;
      }[]
    >`
      SELECT id
      FROM "Inventory"
      WHERE "productId" = ${reservation.productId}
      AND "warehouseId" = ${reservation.warehouseId}
      FOR UPDATE
    `;

    const inventory = inventoryRows[0];

    await tx.inventory.update({
      where: {
        id: inventory.id,
      },
      data: {
        totalStock: {
          decrement: reservation.quantity,
        },
        reservedStock: {
          decrement: reservation.quantity,
        },
      },
    });

    return tx.reservation.update({
      where: {
        id: reservationId,
      },
      data: {
        status: ReservationStatus.CONFIRMED,
      },
    });
  });
}

export async function releaseReservation(
  reservationId: string
) {
  return prisma.$transaction(async (tx) => {
    const reservation = await tx.reservation.findUnique({
      where: {
        id: reservationId,
      },
    });

    if (!reservation) {
      throw new GoneError("Reservation not found");
    }

    if (reservation.status !== ReservationStatus.PENDING) {
      return reservation;
    }

    const inventoryRows = await tx.$queryRaw<
      {
        id: string;
      }[]
    >`
      SELECT id
      FROM "Inventory"
      WHERE "productId" = ${reservation.productId}
      AND "warehouseId" = ${reservation.warehouseId}
      FOR UPDATE
    `;

    const inventory = inventoryRows[0];

    await tx.inventory.update({
      where: {
        id: inventory.id,
      },
      data: {
        reservedStock: {
          decrement: reservation.quantity,
        },
      },
    });

    return tx.reservation.update({
      where: {
        id: reservationId,
      },
      data: {
        status: ReservationStatus.RELEASED,
      },
    });
  });
}