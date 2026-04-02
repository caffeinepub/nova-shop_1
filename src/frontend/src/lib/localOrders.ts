/**
 * Local order store — orders are persisted in localStorage.
 * No backend required.
 */

const ORDERS_KEY = "nova_shop_orders";

export interface LocalOrderItem {
  productId: number;
  quantity: number;
}

export interface LocalOrder {
  id: string;
  principal: string;
  items: LocalOrderItem[];
  totalPrice: number;
  createdAt: number; // timestamp ms
}

export function getLocalOrders(): LocalOrder[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LocalOrder[];
  } catch {
    return [];
  }
}

export function getLocalOrdersByPrincipal(principal: string): LocalOrder[] {
  return getLocalOrders().filter((o) => o.principal === principal);
}

export function addLocalOrder(order: LocalOrder): void {
  const existing = getLocalOrders();
  localStorage.setItem(ORDERS_KEY, JSON.stringify([...existing, order]));
}
