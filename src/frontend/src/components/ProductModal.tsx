import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { useCartContext } from "../context/CartContext";
import { formatPrice, getCategoryPlaceholder } from "../lib/helpers";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartContext();

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
      });
    }
    toast.success(`${product.name} added to cart`);
    onClose();
  };

  const imgSrc = product
    ? product.imageUrl || getCategoryPlaceholder(product.category)
    : "";

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
          data-ocid="product.modal"
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-auto shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/90 hover:bg-secondary transition-colors"
              data-ocid="product.modal.close_button"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="w-full md:w-1/2 aspect-square bg-secondary overflow-hidden shrink-0">
                <img
                  src={imgSrc}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getCategoryPlaceholder(
                      product.category,
                    );
                  }}
                />
              </div>

              {/* Info */}
              <div className="flex flex-col justify-between p-8 gap-6">
                <div>
                  <p className="text-xs font-body tracking-widest uppercase text-muted-foreground mb-2">
                    {product.category}
                  </p>
                  <h2 className="font-editorial text-2xl font-semibold text-foreground leading-tight">
                    {product.name}
                  </h2>
                  <p className="mt-3 font-editorial text-2xl font-medium text-foreground">
                    {formatPrice(product.price)}
                  </p>
                  <p className="mt-4 text-sm font-body text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Quantity */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-body text-muted-foreground tracking-wide">
                      Qty
                    </span>
                    <div className="flex items-center border border-border">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="p-2 hover:bg-secondary transition-colors"
                        data-ocid="product.modal.qty_decrease.button"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-4 py-2 text-sm font-body font-medium min-w-[3rem] text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="p-2 hover:bg-secondary transition-colors"
                        data-ocid="product.modal.qty_increase.button"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Add to cart */}
                  <Button
                    className="w-full font-body tracking-widest uppercase text-sm h-12"
                    onClick={handleAddToCart}
                    data-ocid="product.modal.add_to_cart.button"
                  >
                    <ShoppingBag size={16} className="mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
