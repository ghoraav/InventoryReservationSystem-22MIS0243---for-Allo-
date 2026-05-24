import HomeClient from "@/components/home-client";

import { getProductsWithInventory } from "@/server/services/product.service";

export default async function Home() {
  const products =
    await getProductsWithInventory();

  const transformed =
    products.map((product) => ({
      id: product.id,

      name: product.name,

      description:
        product.description,

      inventories:
        product.inventories.map(
          (inventory) => ({
            warehouseId:
              inventory.warehouseId,

            warehouseName:
              inventory.warehouse
                .name,

            totalStock:
              inventory.totalStock,

            reservedStock:
              inventory.reservedStock,

            availableStock:
              inventory.totalStock -
              inventory.reservedStock,
          })
        ),
    }));

  return (
    <HomeClient
      products={transformed}
    />
  );
}