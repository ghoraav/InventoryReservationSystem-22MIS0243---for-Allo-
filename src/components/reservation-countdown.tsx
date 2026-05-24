"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getRemainingTime,
} from "@/lib/time";

interface Props {
  expiresAt: string;
  onExpire?: () => void;
}

export default function ReservationCountdown({
  expiresAt,
  onExpire,
}: Props) {
  const [time, setTime] = useState(
    getRemainingTime(expiresAt)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const updated =
        getRemainingTime(expiresAt);

      setTime(updated);

      if (updated.expired) {
        clearInterval(interval);

        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

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