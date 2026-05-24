import { success, error } from "@/lib/api-response";
import { getProductsWithInventory } from "@/server/services/product.service";

export async function GET() {
  try {
    const products = await getProductsWithInventory();

    const transformed = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      inventories: product.inventories.map((inventory) => ({
        warehouseId: inventory.warehouseId,
        warehouseName: inventory.warehouse.name,
        totalStock: inventory.totalStock,
        reservedStock: inventory.reservedStock,
        availableStock:
          inventory.totalStock - inventory.reservedStock,
      })),
    }));

    return success(transformed);
  } catch (err) {
    console.error(err);
    return error("Failed to fetch products", 500);
  }
}   