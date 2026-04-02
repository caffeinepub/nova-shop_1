import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { LogIn, Package, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import type { Product } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAllProducts, useMyOrders } from "../hooks/useQueries";
import { formatPrice } from "../lib/helpers";
import type { LocalOrder } from "../lib/localOrders";

function OrderCard({
  order,
  products,
  index,
}: { order: LocalOrder; products: Product[]; index: number }) {
  const getProductName = (id: number) => {
    const p = products.find((prod) => Number(prod.id) === id);
    return p ? p.name : `Product #${id}`;
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.3 }}
      className="border border-border p-6 bg-white"
      data-ocid={`orders.item.${index + 1}`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-1">
            Order
          </p>
          <p className="font-editorial text-base font-semibold">#{order.id}</p>
        </div>
        <div className="text-right">
          <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-1">
            Total
          </p>
          <p className="font-editorial text-base font-semibold">
            {formatPrice(order.totalPrice)}
          </p>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-3">
          Items
        </p>
        <ul className="flex flex-col gap-2">
          {order.items.map((item, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: order items have no unique key
            <li key={i} className="flex items-center justify-between">
              <span className="font-body text-sm text-foreground">
                {getProductName(item.productId)}
              </span>
              <span className="font-body text-sm text-muted-foreground">
                × {item.quantity}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}

export function OrdersPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { data: orders = [], isLoading } = useMyOrders();
  const { data: products = [] } = useAllProducts();

  if (!identity) {
    return (
      <main className="min-h-screen pt-16 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
          data-ocid="orders.auth_required.section"
        >
          <Package
            size={48}
            className="mx-auto mb-4 text-muted-foreground/40"
          />
          <h2 className="font-editorial text-2xl font-semibold mb-3">
            Your Orders
          </h2>
          <p className="font-body text-sm text-muted-foreground mb-8 leading-relaxed">
            Sign in to view your order history and track your purchases.
          </p>
          <Button
            className="font-body tracking-widest uppercase text-sm h-12 px-8"
            onClick={login}
            disabled={isLoggingIn}
            data-ocid="orders.sign_in.button"
          >
            <LogIn size={16} className="mr-2" />
            Sign In
          </Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-editorial text-3xl font-semibold mb-2">
            My Orders
          </h1>
          <p className="font-body text-sm text-muted-foreground">
            {identity.getPrincipal().toString().slice(0, 16)}...
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col gap-6" data-ocid="orders.loading_state">
            {Array.from({ length: 3 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
              <div key={i} className="border border-border p-6">
                <Skeleton className="h-5 w-40 mb-4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
            data-ocid="orders.empty_state"
          >
            <ShoppingBag
              size={48}
              className="mx-auto mb-4 text-muted-foreground/40"
            />
            <h3 className="font-editorial text-xl font-semibold mb-2">
              No orders yet
            </h3>
            <p className="font-body text-sm text-muted-foreground mb-8">
              Start shopping to see your orders here.
            </p>
            <Link to="/">
              <Button
                variant="outline"
                className="font-body tracking-widest uppercase text-xs h-10 px-6"
                data-ocid="orders.shop_now.button"
              >
                Shop Now
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order, idx) => (
              <OrderCard
                key={order.id}
                order={order}
                products={products}
                index={idx}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
