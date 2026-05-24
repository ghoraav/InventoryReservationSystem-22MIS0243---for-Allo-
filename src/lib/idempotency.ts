import { redis } from "@/lib/redis";

const IDEMPOTENCY_TTL_SECONDS =
  60 * 10;

export interface CachedIdempotencyEntry {
  status:
    | "processing"
    | "completed";

  requestHash: string;

  response?: unknown;

  statusCode?: number;
}

export async function getIdempotencyEntry(
  key: string
) {
  return redis.get<CachedIdempotencyEntry>(
    key
  );
}

export async function createProcessingEntry(
  key: string,
  requestHash: string
) {
  return redis.set(
    key,
    {
      status: "processing",
      requestHash,
    },
    {
      nx: true,
      ex: IDEMPOTENCY_TTL_SECONDS,
    }
  );
}

export async function completeIdempotencyEntry(
  key: string,
  requestHash: string,
  response: unknown,
  statusCode: number
) {
  return redis.set(
    key,
    {
      status: "completed",
      requestHash,
      response,
      statusCode,
    },
    {
      ex: IDEMPOTENCY_TTL_SECONDS,
    }
  );
}

export async function deleteIdempotencyEntry(
  key: string
) {
  await redis.del(key);
}