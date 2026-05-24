import {
  Product,
  Reservation,
} from "@/types/product";

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(
    "http://localhost:3000/api/products",
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export async function createReservation(data: {
  productId: string;
  warehouseId: string;
  quantity: number;
}): Promise<Reservation> {
  const res = await fetch(
    "/api/reservations",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const response = await res.json();

  if (!res.ok) {
    throw new Error(
      response.error || "Reservation failed"
    );
  }

  return response;
}

export async function confirmReservation(
  id: string
) {
  const res = await fetch(
    `/api/reservations/${id}/confirm`,
    {
      method: "POST",
    }
  );

  const response = await res.json();

  if (!res.ok) {
    throw new Error(
      response.error || "Confirm failed"
    );
  }

  return response;
}

export async function releaseReservation(
  id: string
) {
  const res = await fetch(
    `/api/reservations/${id}/release`,
    {
      method: "POST",
    }
  );

  const response = await res.json();

  if (!res.ok) {
    throw new Error(
      response.error || "Release failed"
    );
  }

  return response;
}