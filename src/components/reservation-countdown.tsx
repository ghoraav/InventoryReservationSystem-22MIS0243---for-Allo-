"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getRemainingTime,
} from "@/lib/time";

interface Props {
  expiresAt: string | Date;
  onExpire?: () => void;
}

export default function ReservationCountdown({
  expiresAt,
  onExpire,
}: Props) {
  const expiry =
    typeof expiresAt === "string"
      ? expiresAt
      : expiresAt.toISOString();

  const [time, setTime] = useState(
    getRemainingTime(expiry)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const updated =
        getRemainingTime(expiry);

      setTime(updated);

      if (updated.expired) {
        clearInterval(interval);

        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiry, onExpire]);

  return (
    <p
      className={`text-sm font-medium ${
        time.expired
          ? "text-red-500"
          : "text-orange-500"
      }`}
    >
      {time.expired
        ? "Reservation Expired"
        : `Expires in: ${time.formatted}`}
    </p>
  );
}