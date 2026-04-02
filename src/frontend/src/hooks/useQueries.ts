import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { Product } from "../backend.d";
import {
  type LocalOrder,
  addLocalOrder,
  getLocalOrdersByPrincipal,
} from "../lib/localOrders";
import {
  addLocalProduct,
  getLocalProducts,
  updateLocalProduct,
} from "../lib/localProducts";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

/**
 * Primary product source: localStorage.
 * Re-fetches whenever the custom "nova-products-updated" event fires.
 */
export function useAllProducts() {
  const queryClient = useQueryClient();

  // Listen for localStorage updates from admin panel
  useEffect(() => {
    const handler = () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    };
    window.addEventListener("nova-products-updated", handler);
    return () => window.removeEventListener("nova-products-updated", handler);
  }, [queryClient]);

  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: () => getLocalProducts(),
    staleTime: 1000 * 5,
  });
}

export function useProductsByCategory(category: string) {
  const { data: products = [] } = useAllProducts();
  const filtered =
    category === "All"
      ? products
      : products.filter((p) => p.category === category);
  return { data: filtered, isLoading: false };
}

/**
 * Orders are read from localStorage keyed by the user's principal.
 */
export function useMyOrders() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString() ?? null;

  return useQuery<LocalOrder[]>({
    queryKey: ["orders", "my", principal],
    queryFn: () => (principal ? getLocalOrdersByPrincipal(principal) : []),
    enabled: !!principal,
    staleTime: 1000 * 5,
  });
}

/**
 * Place order: saves to localStorage immediately — no backend call.
 */
export function usePlaceOrder() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      items,
      totalPrice,
    }: {
      items: Array<[bigint, bigint]>;
      totalPrice: bigint;
    }) => {
      if (!identity) throw new Error("Not authenticated");
      const principal = identity.getPrincipal().toString();
      const order: LocalOrder = {
        id: `NS-${Date.now().toString(36).toUpperCase()}`,
        principal,
        items: items.map(([productId, quantity]) => ({
          productId: Number(productId),
          quantity: Number(quantity),
        })),
        totalPrice: Number(totalPrice),
        createdAt: Date.now(),
      };
      addLocalOrder(order);
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

/**
 * Add product mutation: saves to localStorage immediately so the storefront
 * updates without any backend dependency.
 */
export function useAddProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Omit<Product, "id">) => {
      return addLocalProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

/**
 * Update product mutation: updates localStorage immediately.
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      updateLocalProduct(product);
      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<boolean>({
    queryKey: ["isAdmin", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60,
  });
}
