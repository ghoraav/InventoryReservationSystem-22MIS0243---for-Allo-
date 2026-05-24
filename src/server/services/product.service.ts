import { prisma } from "@/lib/prisma";

export async function getProductsWithInventory() {
  return prisma.product.findMany({
    include: {
      inventories: {
        include: {
          warehouse: true,
        },
      },
    },
  });
}