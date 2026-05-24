export function getRemainingTime(
  expiresAt: string
) {
  const diff =
    new Date(expiresAt).getTime() -
    Date.now();

  if (diff <= 0) {
    return {
      expired: true,
      formatted: "Expired",
    };
  }

  const minutes = Math.floor(
    diff / 1000 / 60
  );

  const seconds = Math.floor(
    (diff / 1000) % 60
  );

  return {
    expired: false,
    formatted: `${minutes
      .toString()
      .padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`,
  };
}