/**
 * Local product store — products are persisted in localStorage.
 * This is the source of truth for the storefront.
 * The backend is used as a secondary sync target when available.
 */

import type { Product } from "../backend.d";

const STORAGE_KEY = "nova_shop_products";
const NEXT_ID_KEY = "nova_shop_next_id";

function getNextId(): number {
  const stored = localStorage.getItem(NEXT_ID_KEY);
  return stored ? Number.parseInt(stored, 10) : 100001;
}

function incrementNextId(): number {
  const id = getNextId();
  localStorage.setItem(NEXT_ID_KEY, String(id + 1));
  return id;
}

/** Serialisable product stored in localStorage */
interface StoredProduct {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  category: string;
  price: number; // cents as plain number (BigInt not JSON-serialisable)
}

function toStoredProduct(p: Product): StoredProduct {
  return {
    id: Number(p.id),
    name: p.name,
    description: p.description,
    imageUrl: p.imageUrl,
    category: p.category,
    price: Number(p.price),
  };
}

function fromStoredProduct(s: StoredProduct): Product {
  return {
    id: BigInt(s.id),
    name: s.name,
    description: s.description,
    imageUrl: s.imageUrl,
    category: s.category,
    price: BigInt(s.price),
  };
}

/** Read all products from localStorage */
export function getLocalProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const stored: StoredProduct[] = JSON.parse(raw);
    return stored.map(fromStoredProduct);
  } catch {
    return [];
  }
}

/** Add a new product to localStorage. Returns the saved product with its assigned id. */
export function addLocalProduct(product: Omit<Product, "id">): Product {
  const id = incrementNextId();
  const newProduct: Product = { ...product, id: BigInt(id) };
  const existing = getLocalProducts();
  const updated = [...existing, newProduct];
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated.map(toStoredProduct)),
  );
  // Dispatch a custom event so any listening components update immediately
  window.dispatchEvent(new CustomEvent("nova-products-updated"));
  return newProduct;
}

/** Update an existing product in localStorage */
export function updateLocalProduct(product: Product): void {
  const existing = getLocalProducts();
  const updated = existing.map((p) => (p.id === product.id ? product : p));
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated.map(toStoredProduct)),
  );
  window.dispatchEvent(new CustomEvent("nova-products-updated"));
}

/** Delete a product from localStorage */
export function deleteLocalProduct(id: bigint): void {
  const existing = getLocalProducts();
  const updated = existing.filter((p) => p.id !== id);
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated.map(toStoredProduct)),
  );
  window.dispatchEvent(new CustomEvent("nova-products-updated"));
}
