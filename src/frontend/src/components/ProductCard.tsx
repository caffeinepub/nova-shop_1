import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import type { Product } from "../backend.d";
import { formatPrice, getCategoryPlaceholder } from "../lib/helpers";

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  index?: number;
}

export function ProductCard({ product, onClick, index = 0 }: ProductCardProps) {
  const imgSrc = product.imageUrl || getCategoryPlaceholder(product.category);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="group cursor-pointer"
      onClick={() => onClick(product)}
      data-ocid={`product.item.${index + 1}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-secondary aspect-square">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getCategoryPlaceholder(
              product.category,
            );
          }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-300" />
      </div>

      {/* Info */}
      <div className="pt-3 pb-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-body text-sm font-medium text-foreground truncate group-hover:underline underline-offset-2 transition-all">
              {product.name}
            </h3>
            <p className="mt-0.5 text-xs font-body text-muted-foreground tracking-widest uppercase">
              {product.category}
            </p>
          </div>
          <p className="font-body text-sm font-semibold text-foreground shrink-0">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
