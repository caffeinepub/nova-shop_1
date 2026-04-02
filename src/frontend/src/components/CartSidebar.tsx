import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "@tanstack/react-router";
import { LogIn, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCartContext } from "../context/CartContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { formatPrice, getCategoryPlaceholder } from "../lib/helpers";

export function CartSidebar() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    totalItems,
    totalPrice,
  } = useCartContext();
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    closeCart();
    navigate({ to: "/checkout" });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/30"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-elevated flex flex-col"
            data-ocid="cart.sheet"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} />
                <h2 className="font-editorial text-lg font-semibold">
                  Your Cart
                </h2>
                {totalItems > 0 && (
                  <span className="text-sm font-body text-muted-foreground">
                    ({totalItems})
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="p-1.5 hover:bg-secondary rounded transition-colors"
                data-ocid="cart.close_button"
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {items.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col items-center justify-center gap-3 px-8"
                  data-ocid="cart.empty_state"
                >
                  <ShoppingBag size={40} className="text-muted-foreground/40" />
                  <p className="font-body text-sm text-muted-foreground text-center">
                    Your cart is empty.
                  </p>
                  <Button
                    variant="outline"
                    onClick={closeCart}
                    className="mt-2 font-body tracking-wide text-xs uppercase"
                  >
                    Continue Shopping
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="items"
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  {/* Items */}
                  <ScrollArea className="flex-1 px-6 py-4">
                    <div className="flex flex-col gap-5">
                      {items.map((item, idx) => (
                        <div
                          key={item.productId.toString()}
                          className="flex gap-4"
                          data-ocid={`cart.item.${idx + 1}`}
                        >
                          <div className="w-[72px] h-[72px] shrink-0 bg-secondary overflow-hidden">
                            <img
                              src={
                                item.imageUrl ||
                                getCategoryPlaceholder(item.category)
                              }
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  getCategoryPlaceholder(item.category);
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-body text-sm font-medium truncate">
                              {item.name}
                            </p>
                            <p className="font-body text-xs text-muted-foreground tracking-widest uppercase">
                              {item.category}
                            </p>
                            <p className="font-body text-sm font-semibold mt-1">
                              {formatPrice(item.price)}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center border border-border">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      item.productId,
                                      item.quantity - 1,
                                    )
                                  }
                                  className="p-1 hover:bg-secondary transition-colors"
                                  data-ocid={`cart.item.qty_decrease.${idx + 1}`}
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="px-2 py-1 text-xs font-medium min-w-[2rem] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      item.productId,
                                      item.quantity + 1,
                                    )
                                  }
                                  className="p-1 hover:bg-secondary transition-colors"
                                  data-ocid={`cart.item.qty_increase.${idx + 1}`}
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeItem(item.productId)}
                                className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                                data-ocid={`cart.delete_button.${idx + 1}`}
                                aria-label="Remove item"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Footer */}
                  <div className="px-6 py-5 border-t border-border">
                    <Separator className="mb-4" />
                    <div className="flex items-center justify-between mb-5">
                      <span className="font-body text-sm text-muted-foreground">
                        Total
                      </span>
                      <span className="font-editorial text-xl font-semibold">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>

                    {identity ? (
                      <Button
                        className="w-full font-body tracking-widest uppercase text-sm h-12"
                        onClick={handleProceedToCheckout}
                        data-ocid="cart.checkout.button"
                      >
                        Proceed to Checkout
                      </Button>
                    ) : (
                      <div
                        className="flex flex-col gap-3"
                        data-ocid="cart.sign_in_required.section"
                      >
                        <p className="font-body text-xs text-muted-foreground text-center leading-relaxed">
                          You must sign in before placing an order.
                        </p>
                        <Button
                          className="w-full font-body tracking-widest uppercase text-sm h-12"
                          onClick={login}
                          disabled={isLoggingIn}
                          data-ocid="cart.sign_in.button"
                        >
                          <LogIn size={15} className="mr-2" />
                          {isLoggingIn
                            ? "Signing in..."
                            : "Sign In to Checkout"}
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
