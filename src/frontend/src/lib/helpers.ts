/**
 * Shared helper utilities for Nova Shop.
 * These are imported from here (not lib/utils.ts which is protected).
 */

/**
 * Format a price stored as integer cents (BigInt or number) into a USD string.
 * e.g. 12999n => "$129.99"
 */
export function formatPrice(cents: bigint | number): string {
  const amount = typeof cents === "bigint" ? Number(cents) : cents;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / 100);
}

/**
 * Return a placeholder image URL for a given product category.
 */
export function getCategoryPlaceholder(category: string): string {
  const placeholders: Record<string, string> = {
    Watches: "/assets/generated/placeholder-watches.jpg",
    Clothes: "/assets/generated/placeholder-clothes.jpg",
    Shoes: "/assets/generated/placeholder-shoes.jpg",
  };
  return placeholders[category] ?? "/assets/generated/placeholder-watches.jpg";
}
