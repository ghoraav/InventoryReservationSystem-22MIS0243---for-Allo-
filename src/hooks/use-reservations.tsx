"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  Reservation,
} from "@/types/product";

interface ReservationContextType {
  reservations: Reservation[];

  addReservation: (
    reservation: Reservation
  ) => void;

  removeReservation: (
    id: string
  ) => void;

  clearReservations: () => void;
}

const ReservationContext =
  createContext<
    ReservationContextType | undefined
  >(undefined);

export function ReservationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [reservations, setReservations] =
    useState<Reservation[]>([]);

  useEffect(() => {
    const saved =
      localStorage.getItem(
        "reservations"
      );

    if (saved) {
      try {
        const parsed =
          JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setReservations(parsed);
        }
      } catch {
        localStorage.removeItem(
          "reservations"
        );
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "reservations",
      JSON.stringify(reservations)
    );
  }, [reservations]);

  function addReservation(
    reservation: Reservation
  ) {
    setReservations((prev) => [
      ...prev,
      reservation,
    ]);
  }

  function removeReservation(
    id: string
  ) {
    setReservations((prev) =>
      prev.filter(
        (reservation) =>
          reservation.id !== id
      )
    );
  }

  function clearReservations() {
    setReservations([]);
  }

  return (
    <ReservationContext.Provider
      value={{
        reservations,
        addReservation,
        removeReservation,
        clearReservations,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservations() {
  const context = useContext(
    ReservationContext
  );

  if (!context) {
    throw new Error(
      "useReservations must be used inside ReservationProvider"
    );
  }

  return context;
}