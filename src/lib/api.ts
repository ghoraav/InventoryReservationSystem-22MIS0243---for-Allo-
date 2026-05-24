import {
  Product,
  Reservation,
} from "@/types/product";

const API_BASE =
  "/api";

function generateIdempotencyKey() {
  return crypto.randomUUID();
}

export async function getProducts(): Promise<
  Product[]
> {
  const response = await fetch(
    `${API_BASE}/products`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch products"
    );
  }

  return response.json();
}

interface CreateReservationPayload {
  productId: string;
  warehouseId: string;
  quantity: number;
}

export async function createReservation(
  payload: CreateReservationPayload
): Promise<Reservation> {
  const response = await fetch(
    `${API_BASE}/reservations`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        "Idempotency-Key":
          generateIdempotencyKey(),
      },

      body: JSON.stringify(
        payload
      ),
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
        "Failed to create reservation"
    );
  }

  return data;
}

export async function confirmReservation(
  id: string
): Promise<Reservation> {
  const response = await fetch(
    `${API_BASE}/reservations/${id}/confirm`,
    {
      method: "POST",
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
        "Failed to confirm reservation"
    );
  }

  return data;
}

export async function releaseReservation(
  id: string
): Promise<Reservation> {
  const response = await fetch(
    `${API_BASE}/reservations/${id}/release`,
    {
      method: "POST",
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
        "Failed to release reservation"
    );
  }

  return data;
}