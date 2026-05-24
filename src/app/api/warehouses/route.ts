import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/api-response";

export async function GET() {
  try {
    const warehouses = await prisma.warehouse.findMany();

    return success(warehouses);
  } catch (err) {
    console.error(err);
    return error("Failed to fetch warehouses", 500);
  }
}