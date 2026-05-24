"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  Product,
} from "@/types/product";

interface ProductsContextType {
  products: Product[];
  refreshProducts: () => Promise<void>;
}

const ProductsContext =
  createContext<
    ProductsContextType | undefined
  >(undefined);

export function ProductsProvider({
  children,
  initialProducts,
}: {
  children: ReactNode;
  initialProducts: Product[];
}) {
  const [products, setProducts] =
    useState<Product[]>(
      initialProducts
    );

  async function refreshProducts() {
    const res = await fetch(
      "/api/products",
      {
        cache: "no-store",
      }
    );

    const data = await res.json();

    setProducts(data);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      refreshProducts();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        products,
        refreshProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context =
    useContext(ProductsContext);

  if (!context) {
    throw new Error(
      "useProducts must be used inside ProductsProvider"
    );
  }

  return context;
}