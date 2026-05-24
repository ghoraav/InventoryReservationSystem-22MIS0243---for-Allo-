import crypto from "crypto";

export function hashRequestBody(
  body: unknown
) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(body))
    .digest("hex");
}