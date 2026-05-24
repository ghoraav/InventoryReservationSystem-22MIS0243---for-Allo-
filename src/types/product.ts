export interface Inventory {
  warehouseId: string;
  warehouseName: string;
  totalStock: number;
  reservedStock: number;
  availableStock: number;
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