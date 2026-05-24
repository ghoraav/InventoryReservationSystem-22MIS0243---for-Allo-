export interface Inventory {
  id: string;

  productId: string;

  warehouseId: string;

  totalStock: number;

  reservedStock: number;

  createdAt: Date;

  updatedAt: Date;

  warehouse: {
    id: string;
    name: string;
    location: string | null;
    createdAt: Date;
    updatedAt: Date;
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

  expiresAt: Date;

  createdAt: Date;

  updatedAt: Date;
}