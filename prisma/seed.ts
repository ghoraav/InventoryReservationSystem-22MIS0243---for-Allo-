import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prisma.reservation.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.warehouse.deleteMany();

  const bangaloreWarehouse = await prisma.warehouse.create({
    data: {
      name: "Bangalore Warehouse",
      location: "Bangalore",
    },
  });

  const mumbaiWarehouse = await prisma.warehouse.create({
    data: {
      name: "Mumbai Warehouse",
      location: "Mumbai",
    },
  });

  const iphone = await prisma.product.create({
    data: {
      name: "iPhone 15",
      description: "128GB Black Variant",
    },
  });

  const ps5 = await prisma.product.create({
    data: {
      name: "PlayStation 5",
      description: "Slim Edition",
    },
  });

  const macbook = await prisma.product.create({
    data: {
      name: "MacBook Air M3",
      description: "13-inch Laptop",
    },
  });

  await prisma.inventory.createMany({
    data: [
      {
        productId: iphone.id,
        warehouseId: bangaloreWarehouse.id,
        totalStock: 10,
      },
      {
        productId: iphone.id,
        warehouseId: mumbaiWarehouse.id,
        totalStock: 5,
      },
      {
        productId: ps5.id,
        warehouseId: bangaloreWarehouse.id,
        totalStock: 3,
      },
      {
        productId: macbook.id,
        warehouseId: mumbaiWarehouse.id,
        totalStock: 7,
      },
    ],
  });

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });