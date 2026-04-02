import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  LogIn,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useCartContext } from "../context/CartContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { cn } from "../lib/utils";

export function Navbar() {
  const { totalItems, openCart } = useCartContext();
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const categories = ["Watches", "Clothes", "Shoes"];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-xs border-b border-border"
          : "bg-white border-b border-border",
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="font-editorial text-xl font-bold tracking-widest uppercase text-foreground hover:opacity-70 transition-opacity"
            data-ocid="nav.link"
          >
            Nova Shop
          </Link>

          {/* Desktop Category Nav */}
          <div className="hidden md:flex items-center gap-8">
            {categories.map((cat) => (
              <Link
                key={cat}
                to="/"
                search={{ category: cat }}
                className="font-body text-sm tracking-wide uppercase text-muted-foreground hover:text-foreground transition-colors letter-wide"
                data-ocid={`nav.${cat.toLowerCase()}.link`}
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {identity && (
              <Link
                to="/orders"
                className="hidden md:flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                data-ocid="nav.orders.link"
              >
                <Package size={18} />
                <span className="tracking-wide">Orders</span>
              </Link>
            )}

            <Link
              to="/admin"
              className="hidden md:flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
              data-ocid="nav.admin.link"
            >
              <User size={18} />
              <span className="tracking-wide">Admin</span>
            </Link>

            {/* Sign In / Sign Out */}
            {identity ? (
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex items-center gap-1.5 font-body text-sm tracking-wide text-muted-foreground hover:text-foreground px-2"
                onClick={clear}
                data-ocid="nav.sign_out.button"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex items-center gap-1.5 font-body text-sm tracking-wide text-muted-foreground hover:text-foreground px-2"
                onClick={login}
                disabled={isLoggingIn}
                data-ocid="nav.sign_in.button"
              >
                <LogIn size={16} />
                <span>{isLoggingIn ? "Signing in..." : "Sign In"}</span>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={openCart}
              data-ocid="nav.cart.button"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 flex items-center justify-center rounded-full bg-foreground text-background text-[10px] font-semibold">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Button>

            {/* Mobile menu */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              data-ocid="nav.mobile_menu.button"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="md:hidden border-t border-border bg-white overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => {
                    navigate({ to: "/", search: { category: cat } });
                    setMobileOpen(false);
                  }}
                  className="text-left font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors py-1"
                  data-ocid={`nav.mobile.${cat.toLowerCase()}.link`}
                >
                  {cat}
                </button>
              ))}
              <hr className="border-border my-1" />
              {identity && (
                <button
                  type="button"
                  onClick={() => {
                    navigate({ to: "/orders" });
                    setMobileOpen(false);
                  }}
                  className="text-left font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors py-1"
                  data-ocid="nav.mobile.orders.link"
                >
                  My Orders
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  navigate({ to: "/admin" });
                  setMobileOpen(false);
                }}
                className="text-left font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors py-1"
                data-ocid="nav.mobile.admin.link"
              >
                Admin
              </button>
              <hr className="border-border my-1" />
              {identity ? (
                <button
                  type="button"
                  onClick={() => {
                    clear();
                    setMobileOpen(false);
                  }}
                  className="text-left font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors py-1 flex items-center gap-2"
                  data-ocid="nav.mobile.sign_out.button"
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    login();
                    setMobileOpen(false);
                  }}
                  className="text-left font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors py-1 flex items-center gap-2"
                  data-ocid="nav.mobile.sign_in.button"
                >
                  <LogIn size={15} />
                  Sign In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
