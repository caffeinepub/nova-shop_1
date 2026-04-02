import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearch } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import type { Product } from "../backend.d";
import { ProductCard } from "../components/ProductCard";
import { ProductModal } from "../components/ProductModal";
import { useAllProducts } from "../hooks/useQueries";
import type { CategoryFilter } from "../types";

const CATEGORIES: CategoryFilter[] = ["All", "Watches", "Clothes", "Shoes"];

export function HomePage() {
  const search = useSearch({ from: "/" }) as { category?: string };
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>(
    (search?.category as CategoryFilter) || "All",
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const { data: products = [], isLoading } = useAllProducts();

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const scrollToGrid = useCallback(() => {
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero.dim_1400x700.jpg"
            alt="Nova Shop hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/55" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative z-10 text-center px-4 max-w-3xl mx-auto"
        >
          <p className="font-body text-white/80 text-xs tracking-[0.3em] uppercase mb-4">
            Est. 2024
          </p>
          <h1 className="font-editorial text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight">
            Nova Shop
          </h1>
          <p className="mt-5 font-body text-lg sm:text-xl text-white/90 font-light max-w-lg mx-auto leading-relaxed">
            Premium quality, timeless style.
          </p>
          <p className="mt-3 font-body text-sm text-white/70 max-w-md mx-auto leading-relaxed">
            Discover our curated collection of watches, clothing, and footwear
            crafted for modern living.
          </p>
          <Button
            size="lg"
            className="mt-8 font-body tracking-[0.2em] uppercase text-sm h-12 px-10 bg-white text-foreground hover:bg-white/90"
            onClick={scrollToGrid}
            data-ocid="hero.shop_now.button"
          >
            Shop Now
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60"
        >
          <ChevronDown size={24} className="animate-bounce" />
        </motion.div>
      </section>

      {/* Products Section */}
      <section
        ref={gridRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="font-editorial text-3xl font-semibold text-center mb-2">
            Our Collection
          </h2>
          <p className="font-body text-sm text-muted-foreground text-center tracking-wide">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </p>

          {/* Category tabs */}
          <div
            className="flex justify-center mt-8"
            data-ocid="products.filter.tab"
          >
            <Tabs
              value={activeCategory}
              onValueChange={(v) => setActiveCategory(v as CategoryFilter)}
            >
              <TabsList className="bg-secondary border border-border h-auto p-1">
                {CATEGORIES.map((cat) => (
                  <TabsTrigger
                    key={cat}
                    value={cat}
                    className="font-body text-xs tracking-widest uppercase px-6 py-2 data-[state=active]:bg-foreground data-[state=active]:text-background"
                    data-ocid={`products.filter.${cat.toLowerCase()}.tab`}
                  >
                    {cat}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </motion.div>

        {/* Grid */}
        {isLoading ? (
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8"
            data-ocid="products.loading_state"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
            data-ocid="products.empty_state"
          >
            <p className="font-body text-muted-foreground">
              No products found in this category.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {filtered.map((product, idx) => (
              <ProductCard
                key={product.id.toString()}
                product={product}
                onClick={setSelectedProduct}
                index={idx}
              />
            ))}
          </div>
        )}
      </section>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </main>
  );
}
