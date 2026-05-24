"use client";

import {
  createContext,
  useContext,
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

  function addReservation(
    reservation: Reservation
  ) {
    setReservations((prev) => [
      ...prev,
      reservation,
    ]);
  }

  function removeReservation(id: string) {
    setReservations((prev) =>
      prev.filter((r) => r.id !== id)
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