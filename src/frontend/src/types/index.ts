export interface CartItem {
  productId: bigint;
  name: string;
  price: bigint;
  imageUrl?: string;
  category: string;
  quantity: number;
}

export interface LocalProduct {
  id: bigint;
  name: string;
  description: string;
  imageUrl?: string;
  category: string;
  price: bigint;
}

export type CategoryFilter = "All" | "Watches" | "Clothes" | "Shoes";
