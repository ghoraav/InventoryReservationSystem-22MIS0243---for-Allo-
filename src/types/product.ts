export interface Inventory {
  id: string;

  productId: string;

  warehouseId: string;

  totalStock: number;

  reservedStock: number;

  createdAt: string;

  updatedAt: string;

  warehouse: {
    id: string;
    name: string;
    location: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  inventories: Inventory[];
}

export interface Reservation {
  id: string;

  productId: string;

  productName: string;

  warehouseId: string;

  warehouseName: string;

  quantity: number;

  status: string;

  expiresAt: string;

  createdAt: string;

  updatedAt: string;
}