import HomeClient
  from "@/components/home-client";

import {
  getProductsWithInventory,
} from "@/server/services/product.service";

export default async function Home() {
  const products =
    await getProductsWithInventory();

  return (
    <HomeClient
      products={products}
    />
  );
}