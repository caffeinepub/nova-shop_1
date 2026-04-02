import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  CreditCard,
  Lock,
  LogIn,
  Package,
  ShoppingBag,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { useCartContext } from "../context/CartContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { usePlaceOrder } from "../hooks/useQueries";
import { formatPrice, getCategoryPlaceholder } from "../lib/helpers";
import { cn } from "../lib/utils";

// ---------------------------------------------------------------------------
// Card brand definitions
// ---------------------------------------------------------------------------
const CARD_BRANDS = [
  {
    id: "visa",
    label: "Visa",
    color: "#1A1F71",
    bg: "#EEF1FB",
    textColor: "#1A1F71",
  },
  {
    id: "mastercard",
    label: "Mastercard",
    color: "#EB001B",
    bg: "#FEF0F1",
    textColor: "#991B1B",
  },
  {
    id: "amex",
    label: "Amex",
    color: "#007BC1",
    bg: "#EBF5FB",
    textColor: "#1E40AF",
  },
  {
    id: "discover",
    label: "Discover",
    color: "#FF6600",
    bg: "#FFF4EE",
    textColor: "#92400E",
  },
  {
    id: "maestro",
    label: "Maestro",
    color: "#009BE0",
    bg: "#EBF7FD",
    textColor: "#0369A1",
  },
] as const;

type CardBrandId = (typeof CARD_BRANDS)[number]["id"];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

function generateOrderNumber(): string {
  return `NS-${Date.now().toString(36).toUpperCase()}-${Math.floor(
    Math.random() * 1000,
  )
    .toString()
    .padStart(3, "0")}`;
}

// ---------------------------------------------------------------------------
// Countries
// ---------------------------------------------------------------------------
const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Netherlands",
  "Spain",
  "Italy",
  "Japan",
  "South Korea",
  "Singapore",
  "Brazil",
  "Mexico",
  "Argentina",
  "United Arab Emirates",
  "Saudi Arabia",
  "India",
  "China",
  "Other",
];

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartContext();
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const placeOrder = usePlaceOrder();

  // Order success state
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  // Contact & Shipping
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");

  // Payment
  const [selectedBrand, setSelectedBrand] = useState<CardBrandId>("visa");
  const [cardNumber, setCardNumber] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const grandTotal = totalPrice;

  // --------------------------------------------------------------------------
  // Sign-in gate
  // --------------------------------------------------------------------------
  if (!identity) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
          data-ocid="checkout.auth_required.section"
        >
          <Lock size={48} className="mx-auto mb-4 text-muted-foreground/40" />
          <h2 className="font-editorial text-2xl font-semibold mb-3">
            Sign In to Checkout
          </h2>
          <p className="font-body text-sm text-muted-foreground mb-8 leading-relaxed">
            You must be signed in to place an order. Please sign in to continue.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              className="font-body tracking-widest uppercase text-sm h-12 px-8"
              onClick={login}
              disabled={isLoggingIn}
              data-ocid="checkout.sign_in.button"
            >
              <LogIn size={16} className="mr-2" />
              {isLoggingIn ? "Signing in..." : "Sign In"}
            </Button>
            <Link to="/">
              <Button
                variant="outline"
                className="w-full sm:w-auto font-body tracking-widest uppercase text-sm h-12 px-8"
                data-ocid="checkout.back_to_shop.button"
              >
                <ShoppingBag size={16} className="mr-2" />
                Back to Shop
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  // Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "A valid email is required.";
    if (!phone.trim()) newErrors.phone = "Phone number is required.";
    if (!address1.trim()) newErrors.address1 = "Address is required.";
    if (!city.trim()) newErrors.city = "City is required.";
    if (!stateProvince.trim())
      newErrors.stateProvince = "State / Province is required.";
    if (!zip.trim()) newErrors.zip = "ZIP / Postal code is required.";
    if (!country) newErrors.country = "Country is required.";
    const rawCard = cardNumber.replace(/\s/g, "");
    if (rawCard.length < 13 || rawCard.length > 16)
      newErrors.cardNumber = "Enter a valid 13\u201316 digit card number.";
    if (!nameOnCard.trim()) newErrors.nameOnCard = "Name on card is required.";
    const expiryParts = expiry.split("/");
    if (
      expiryParts.length !== 2 ||
      expiryParts[0].length !== 2 ||
      expiryParts[1].length !== 2
    )
      newErrors.expiry = "Enter expiry as MM/YY.";
    if (cvv.length < 3 || cvv.length > 4)
      newErrors.cvv = "CVV must be 3\u20134 digits.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    if (!validate()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    try {
      if (identity) {
        const orderItems: Array<[bigint, bigint]> = items.map((item) => [
          item.productId,
          BigInt(item.quantity),
        ]);
        await placeOrder.mutateAsync({
          items: orderItems,
          totalPrice: BigInt(Math.round(grandTotal)),
        });
      }
      const num = generateOrderNumber();
      setOrderNumber(num);
      clearCart();
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  // --------------------------------------------------------------------------
  // Success screen
  // --------------------------------------------------------------------------
  if (orderNumber) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-md w-full text-center"
          data-ocid="checkout.success_state"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 size={40} className="text-green-600" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">
              Order Confirmed
            </p>
            <h1 className="font-editorial text-3xl font-semibold mb-3">
              Thank You!
            </h1>
            <p className="font-body text-sm text-muted-foreground mb-2 leading-relaxed">
              Your order has been placed successfully. We&#39;re preparing it
              now.
            </p>
            <div className="inline-block border border-border px-4 py-2 mb-8">
              <span className="font-body text-xs text-muted-foreground tracking-wide uppercase mr-2">
                Order
              </span>
              <span className="font-editorial font-semibold text-sm">
                {orderNumber}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link to="/">
              <Button
                variant="outline"
                className="w-full sm:w-auto font-body tracking-widest uppercase text-xs h-11 px-6"
                data-ocid="checkout.continue_shopping.button"
              >
                <ShoppingBag size={14} className="mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <Link to="/orders">
              <Button
                className="w-full sm:w-auto font-body tracking-widest uppercase text-xs h-11 px-6"
                data-ocid="checkout.view_orders.button"
              >
                <Package size={14} className="mr-2" />
                View My Orders
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </main>
    );
  }

  // --------------------------------------------------------------------------
  // Empty cart
  // --------------------------------------------------------------------------
  if (items.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
          data-ocid="checkout.empty_state"
        >
          <ShoppingBag
            size={48}
            className="mx-auto mb-4 text-muted-foreground/40"
          />
          <h2 className="font-editorial text-2xl font-semibold mb-3">
            Your cart is empty
          </h2>
          <p className="font-body text-sm text-muted-foreground mb-8">
            Add some products before checking out.
          </p>
          <Link to="/">
            <Button
              className="font-body tracking-widest uppercase text-xs h-11 px-8"
              data-ocid="checkout.shop_now.button"
            >
              Shop Now
            </Button>
          </Link>
        </motion.div>
      </main>
    );
  }

  // --------------------------------------------------------------------------
  // Checkout form
  // --------------------------------------------------------------------------
  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-1">
            Nova Shop
          </p>
          <h1 className="font-editorial text-3xl md:text-4xl font-semibold">
            Checkout
          </h1>
        </motion.div>

        <form onSubmit={handleSubmit} noValidate data-ocid="checkout.dialog">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start">
            {/* ----------------------------------------------------------------
                LEFT
            ---------------------------------------------------------------- */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col gap-10"
            >
              {/* Contact & Shipping */}
              <section aria-labelledby="shipping-heading">
                <h2
                  id="shipping-heading"
                  className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-5"
                >
                  Contact &amp; Shipping
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="flex flex-col gap-1.5">
                    <Label
                      htmlFor="full-name"
                      className="font-body text-xs tracking-wide uppercase"
                    >
                      Full Name *
                    </Label>
                    <Input
                      id="full-name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Doe"
                      autoComplete="name"
                      className={cn(
                        "font-body text-sm h-11",
                        errors.fullName && "border-destructive",
                      )}
                      data-ocid="checkout.full_name.input"
                    />
                    {errors.fullName && (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="checkout.full_name.error_state"
                      >
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <Label
                      htmlFor="email"
                      className="font-body text-xs tracking-wide uppercase"
                    >
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      autoComplete="email"
                      className={cn(
                        "font-body text-sm h-11",
                        errors.email && "border-destructive",
                      )}
                      data-ocid="checkout.email.input"
                    />
                    {errors.email && (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="checkout.email.error_state"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <Label
                      htmlFor="phone"
                      className="font-body text-xs tracking-wide uppercase"
                    >
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      autoComplete="tel"
                      className={cn(
                        "font-body text-sm h-11",
                        errors.phone && "border-destructive",
                      )}
                      data-ocid="checkout.phone.input"
                    />
                    {errors.phone && (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="checkout.phone.error_state"
                      >
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Address Line 1 */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <Label
                      htmlFor="address1"
                      className="font-body text-xs tracking-wide uppercase"
                    >
                      Address Line 1 *
                    </Label>
                    <Input
                      id="address1"
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                      placeholder="123 Main Street"
                      autoComplete="address-line1"
                      className={cn(
                        "font-body text-sm h-11",
                        errors.address1 && "border-destructive",
                      )}
                      data-ocid="checkout.address.input"
                    />
                    {errors.address1 && (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="checkout.address.error_state"
                      >
                        {errors.address1}
                      </p>
                    )}
                  </div>

                  {/* Address Line 2 */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <Label
                      htmlFor="address2"
                      className="font-body text-xs tracking-wide uppercase"
                    >
                      Address Line 2
                      <span className="text-muted-foreground ml-1">
                        (optional)
                      </span>
                    </Label>
                    <Input
                      id="address2"
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                      placeholder="Apt 4B, Floor 2"
                      autoComplete="address-line2"
                      className="font-body text-sm h-11"
                      data-ocid="checkout.address2.input"
                    />
                  </div>

                  {/* City */}
                  <div className="flex flex-col gap-1.5">
                    <Label
                      htmlFor="city"
                      className="font-body text-xs tracking-wide uppercase"
                    >
                      City *
                    </Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="New York"
                      autoComplete="address-level2"
                      className={cn(
                        "font-body text-sm h-11",
                        errors.city && "border-destructive",
                      )}
                      data-ocid="checkout.city.input"
                    />
                    {errors.city && (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="checkout.city.error_state"
                      >
                        {errors.city}
                      </p>
                    )}
                  </div>

                  {/* State/Province */}
                  <div className="flex flex-col gap-1.5">
                    <Label
                      htmlFor="state"
                      className="font-body text-xs tracking-wide uppercase"
                    >
                      State / Province *
                    </Label>
                    <Input
                      id="state"
                      value={stateProvince}
                      onChange={(e) => setStateProvince(e.target.value)}
                      placeholder="NY"
                      autoComplete="address-level1"
                      className={cn(
                        "font-body text-sm h-11",
                        errors.stateProvince && "border-destructive",
                      )}
                      data-ocid="checkout.state.input"
                    />
                    {errors.stateProvince && (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="checkout.state.error_state"
                      >
                        {errors.stateProvince}
                      </p>
                    )}
                  </div>

                  {/* ZIP */}
                  <div className="flex flex-col gap-1.5">
                    <Label
                      htmlFor="zip"
                      className="font-body text-xs tracking-wide uppercase"
                    >
                      ZIP / Postal Code *
                    </Label>
                    <Input
                      id="zip"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="10001"
                      autoComplete="postal-code"
                      className={cn(
                        "font-body text-sm h-11",
                        errors.zip && "border-destructive",
                      )}
                      data-ocid="checkout.zip.input"
                    />
                    {errors.zip && (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="checkout.zip.error_state"
                      >
                        {errors.zip}
                      </p>
                    )}
                  </div>

                  {/* Country */}
                  <div className="flex flex-col gap-1.5">
                    <Label
                      htmlFor="country"
                      className="font-body text-xs tracking-wide uppercase"
                    >
                      Country *
                    </Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger
                        id="country"
                        className={cn(
                          "font-body text-sm h-11",
                          errors.country && "border-destructive",
                        )}
                        data-ocid="checkout.country.select"
                      >
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((c) => (
                          <SelectItem
                            key={c}
                            value={c}
                            className="font-body text-sm"
                          >
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.country && (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="checkout.country.error_state"
                      >
                        {errors.country}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <Separator />

              {/* Payment */}
              <section aria-labelledby="payment-heading">
                <h2
                  id="payment-heading"
                  className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-5"
                >
                  Payment
                </h2>

                {/* Card brand selector using hidden radios for semantics */}
                <fieldset className="mb-5 border-0 p-0 m-0">
                  <legend className="font-body text-xs tracking-wide uppercase mb-3">
                    Card Type
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {CARD_BRANDS.map((brand) => (
                      <label
                        key={brand.id}
                        style={{
                          backgroundColor:
                            selectedBrand === brand.id ? brand.bg : undefined,
                          borderColor:
                            selectedBrand === brand.id
                              ? brand.color
                              : undefined,
                          color:
                            selectedBrand === brand.id
                              ? brand.textColor
                              : undefined,
                        }}
                        className={cn(
                          "cursor-pointer px-4 py-2 border text-xs font-body font-semibold tracking-widest uppercase rounded transition-all duration-150 flex items-center gap-1.5",
                          selectedBrand === brand.id
                            ? "shadow-sm ring-1 ring-inset"
                            : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                        )}
                        data-ocid={`checkout.card_brand.${brand.id}.toggle`}
                      >
                        <input
                          type="radio"
                          name="card-brand"
                          value={brand.id}
                          checked={selectedBrand === brand.id}
                          onChange={() => setSelectedBrand(brand.id)}
                          className="sr-only"
                        />
                        <CreditCard size={13} />
                        {brand.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card Number */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <Label
                      htmlFor="card-number"
                      className="font-body text-xs tracking-wide uppercase"
                    >
                      Card Number *
                    </Label>
                    <Input
                      id="card-number"
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(formatCardNumber(e.target.value))
                      }
                      placeholder="1234 5678 9012 3456"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      maxLength={19}
                      className={cn(
                        "font-body text-sm h-11 tracking-widest",
                        errors.cardNumber && "border-destructive",
                      )}
                      data-ocid="checkout.card_number.input"
                    />
                    {errors.cardNumber && (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="checkout.card_number.error_state"
                      >
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>

                  {/* Name on Card */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <Label
                      htmlFor="name-on-card"
                      className="font-body text-xs tracking-wide uppercase"
                    >
                      Name on Card *
                    </Label>
                    <Input
                      id="name-on-card"
                      value={nameOnCard}
                      onChange={(e) => setNameOnCard(e.target.value)}
                      placeholder="Jane Doe"
                      autoComplete="cc-name"
                      className={cn(
                        "font-body text-sm h-11",
                        errors.nameOnCard && "border-destructive",
                      )}
                      data-ocid="checkout.name_on_card.input"
                    />
                    {errors.nameOnCard && (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="checkout.name_on_card.error_state"
                      >
                        {errors.nameOnCard}
                      </p>
                    )}
                  </div>

                  {/* Expiry */}
                  <div className="flex flex-col gap-1.5">
                    <Label
                      htmlFor="expiry"
                      className="font-body text-xs tracking-wide uppercase"
                    >
                      Expiry (MM/YY) *
                    </Label>
                    <Input
                      id="expiry"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      maxLength={5}
                      className={cn(
                        "font-body text-sm h-11",
                        errors.expiry && "border-destructive",
                      )}
                      data-ocid="checkout.expiry.input"
                    />
                    {errors.expiry && (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="checkout.expiry.error_state"
                      >
                        {errors.expiry}
                      </p>
                    )}
                  </div>

                  {/* CVV */}
                  <div className="flex flex-col gap-1.5">
                    <Label
                      htmlFor="cvv"
                      className="font-body text-xs tracking-wide uppercase"
                    >
                      CVV *
                    </Label>
                    <Input
                      id="cvv"
                      value={cvv}
                      onChange={(e) =>
                        setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                      }
                      placeholder="123"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      maxLength={4}
                      className={cn(
                        "font-body text-sm h-11",
                        errors.cvv && "border-destructive",
                      )}
                      data-ocid="checkout.cvv.input"
                    />
                    {errors.cvv && (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="checkout.cvv.error_state"
                      >
                        {errors.cvv}
                      </p>
                    )}
                  </div>
                </div>

                <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-4 font-body">
                  <Lock size={12} />
                  Your payment details are secured with 256-bit encryption. This
                  is a demo store &#8212; no real charges will be made.
                </p>
              </section>

              {/* Submit button visible on mobile */}
              <div className="lg:hidden">
                <Button
                  type="submit"
                  disabled={placeOrder.isPending}
                  className="w-full h-12 font-body tracking-widest uppercase text-sm"
                  data-ocid="checkout.submit_button"
                >
                  {placeOrder.isPending
                    ? "Processing..."
                    : `Place Order \u00b7 ${formatPrice(grandTotal)}`}
                </Button>
              </div>
            </motion.div>

            {/* ----------------------------------------------------------------
                RIGHT - order summary
            ---------------------------------------------------------------- */}
            <motion.aside
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:sticky lg:top-24"
              aria-label="Order summary"
            >
              <div className="border border-border bg-white p-6">
                <h2 className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-5">
                  Order Summary
                </h2>

                {/* Items */}
                <ul className="flex flex-col gap-5 mb-6">
                  <AnimatePresence>
                    {items.map((item, idx) => (
                      <motion.li
                        key={item.productId.toString()}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.06 }}
                        className="flex gap-4"
                        data-ocid={`checkout.item.${idx + 1}`}
                      >
                        <div className="w-16 h-16 shrink-0 bg-secondary overflow-hidden">
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
                          <p className="font-body text-sm font-medium leading-snug truncate">
                            {item.name}
                          </p>
                          <p className="font-body text-xs text-muted-foreground tracking-widest uppercase mt-0.5">
                            {item.category}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="font-body text-xs text-muted-foreground">
                              Qty: {item.quantity}
                            </span>
                            <span className="font-body text-sm font-semibold">
                              {formatPrice(Number(item.price) * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <Separator className="mb-4" />

                {/* Subtotal / Shipping / Total */}
                <div className="flex flex-col gap-2 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm text-muted-foreground">
                      Subtotal
                    </span>
                    <span className="font-body text-sm">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm text-muted-foreground">
                      Shipping
                    </span>
                    <span className="font-body text-sm font-medium text-green-700">
                      Free
                    </span>
                  </div>
                </div>

                <Separator className="mb-4" />

                <div className="flex items-center justify-between mb-6">
                  <span className="font-body text-sm font-semibold">
                    Grand Total
                  </span>
                  <span className="font-editorial text-xl font-semibold">
                    {formatPrice(grandTotal)}
                  </span>
                </div>

                {/* Submit button - desktop */}
                <Button
                  type="submit"
                  disabled={placeOrder.isPending}
                  className="hidden lg:flex w-full h-12 font-body tracking-widest uppercase text-sm"
                  data-ocid="checkout.submit_button"
                >
                  {placeOrder.isPending
                    ? "Processing..."
                    : `Place Order \u00b7 ${formatPrice(grandTotal)}`}
                </Button>

                <p className="hidden lg:flex items-center justify-center gap-1.5 text-xs text-muted-foreground mt-3 font-body">
                  <Lock size={11} />
                  Secured checkout
                </p>
              </div>
            </motion.aside>
          </div>
        </form>
      </div>
    </main>
  );
}
