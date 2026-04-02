import { Badge } from "@/components/ui/badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Check,
  Edit2,
  Image as ImageIcon,
  Loader2,
  Lock,
  Plus,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import {
  useAddProduct,
  useAllProducts,
  useUpdateProduct,
} from "../hooks/useQueries";
import { formatPrice, getCategoryPlaceholder } from "../lib/helpers";
import { deleteLocalProduct } from "../lib/localProducts";

const ADMIN_PASSWORD = "mshd1981";
const CATEGORIES = ["Watches", "Clothes", "Shoes"];

interface ProductFormState {
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
}

const emptyForm: ProductFormState = {
  name: "",
  description: "",
  price: "",
  category: "Watches",
  imageUrl: "",
};

function ProductForm({
  initial,
  onSubmit,
  onCancel,
  isLoading,
  title,
}: {
  initial?: ProductFormState;
  onSubmit: (form: ProductFormState, imageFile?: File) => void;
  onCancel: () => void;
  isLoading: boolean;
  title: string;
}) {
  const [form, setForm] = useState<ProductFormState>(initial ?? emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    initial?.imageUrl ?? "",
  );
  const fileRef = useRef<HTMLInputElement>(null);

  const setField = (field: keyof ProductFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageFile = (file: File) => {
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) handleImageFile(file);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (
      !form.price ||
      Number.isNaN(Number.parseFloat(form.price)) ||
      Number.parseFloat(form.price) <= 0
    ) {
      toast.error("Please enter a valid price");
      return;
    }
    onSubmit(form, imageFile ?? undefined);
  };

  return (
    <div className="bg-secondary/40 border border-border p-6 rounded-sm">
      <h3 className="font-editorial text-lg font-semibold mb-5">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="p-name"
            className="font-body text-xs tracking-wide uppercase"
          >
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="p-name"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="Product name"
            className="font-body"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="p-price"
            className="font-body text-xs tracking-wide uppercase"
          >
            Price (USD) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="p-price"
            value={form.price}
            onChange={(e) => setField("price", e.target.value)}
            placeholder="e.g. 129.99"
            type="number"
            min="0"
            step="0.01"
            className="font-body"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="p-category"
            className="font-body text-xs tracking-wide uppercase"
          >
            Category
          </Label>
          <Select
            value={form.category}
            onValueChange={(v) => setField("category", v)}
          >
            <SelectTrigger className="font-body">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat} className="font-body">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="p-imgurl"
            className="font-body text-xs tracking-wide uppercase"
          >
            Image URL (optional)
          </Label>
          <Input
            id="p-imgurl"
            value={form.imageUrl}
            onChange={(e) => setField("imageUrl", e.target.value)}
            placeholder="https://..."
            className="font-body"
          />
        </div>

        <div className="md:col-span-2 flex flex-col gap-1.5">
          <Label
            htmlFor="p-description"
            className="font-body text-xs tracking-wide uppercase"
          >
            Description
          </Label>
          <Textarea
            id="p-description"
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Product description..."
            rows={3}
            className="font-body resize-none"
          />
        </div>

        {/* Image upload */}
        <div className="md:col-span-2 flex flex-col gap-2">
          <Label className="font-body text-xs tracking-wide uppercase">
            Upload Image
          </Label>
          <label
            htmlFor="file-upload-dropzone"
            className="relative border-2 border-dashed border-border rounded-sm p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-foreground/40 transition-colors bg-white"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 object-contain"
                />
                <p className="font-body text-xs text-muted-foreground">
                  Click to change image
                </p>
              </>
            ) : (
              <>
                <ImageIcon size={28} className="text-muted-foreground/50" />
                <p className="font-body text-xs text-muted-foreground text-center">
                  Drag &amp; drop or click to upload image
                </p>
              </>
            )}
            <input
              ref={fileRef}
              id="file-upload-dropzone"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFileInput}
            />
          </label>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="font-body text-xs tracking-wide uppercase"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          data-ocid="admin.product.save_button"
          className="font-body text-xs tracking-wide uppercase"
        >
          {isLoading ? (
            <>
              <Loader2 size={14} className="mr-1.5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check size={14} className="mr-1.5" />
              Save Product
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export function AdminPage() {
  const [password, setPassword] = useState("");
  // Never persist admin unlock — always require password on each visit
  const [unlocked, setUnlocked] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data: products = [] } = useAllProducts();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();

  const handleUnlock = () => {
    if (password === ADMIN_PASSWORD) {
      setUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  // Convert a File to a base64 data URL
  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAddProduct = async (form: ProductFormState, imageFile?: File) => {
    let finalImageUrl = form.imageUrl.trim();
    if (imageFile) {
      toast.loading("Processing image...", { id: "img-upload" });
      try {
        finalImageUrl = await fileToDataUrl(imageFile);
      } finally {
        toast.dismiss("img-upload");
      }
    }

    const priceCents = Math.round(Number.parseFloat(form.price) * 100);

    addProduct.mutate(
      {
        name: form.name.trim(),
        description: form.description.trim(),
        imageUrl: finalImageUrl || undefined,
        category: form.category,
        price: BigInt(priceCents),
      },
      {
        onSuccess: () => {
          toast.success("Product added — visible to customers now");
          setShowAddForm(false);
        },
        onError: (e) => {
          toast.error(
            `Failed to add product: ${
              e instanceof Error ? e.message : String(e)
            }`,
          );
        },
      },
    );
  };

  const handleEditProduct = async (
    form: ProductFormState,
    imageFile?: File,
  ) => {
    if (!editingProduct) return;

    let finalImageUrl = form.imageUrl.trim();
    if (imageFile) {
      toast.loading("Processing image...", { id: "img-upload" });
      try {
        finalImageUrl = await fileToDataUrl(imageFile);
      } finally {
        toast.dismiss("img-upload");
      }
    }

    const priceCents = Math.round(Number.parseFloat(form.price) * 100);

    updateProduct.mutate(
      {
        ...editingProduct,
        name: form.name.trim(),
        description: form.description.trim(),
        imageUrl: finalImageUrl || undefined,
        category: form.category,
        price: BigInt(priceCents),
      },
      {
        onSuccess: () => {
          toast.success("Product updated");
          setEditingProduct(null);
        },
        onError: (e) => {
          toast.error(
            `Failed to update: ${e instanceof Error ? e.message : String(e)}`,
          );
        },
      },
    );
  };

  const handleDelete = (product: Product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    deleteLocalProduct(product.id);
    toast.success("Product deleted");
  };

  // Password gate
  if (!unlocked) {
    return (
      <main className="min-h-screen pt-16 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <Lock size={32} className="mx-auto mb-4 text-foreground/60" />
            <h1 className="font-editorial text-2xl font-semibold">
              Admin Access
            </h1>
            <p className="font-body text-sm text-muted-foreground mt-2">
              Enter the admin password to continue.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
              }}
              placeholder="Password"
              className={`font-body h-12 ${
                passwordError ? "border-destructive" : ""
              }`}
              onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
              data-ocid="admin.input"
            />
            {passwordError && (
              <p
                className="font-body text-xs text-destructive"
                data-ocid="admin.error_state"
              >
                Incorrect password. Please try again.
              </p>
            )}
            <Button
              className="w-full font-body tracking-widest uppercase text-sm h-12"
              onClick={handleUnlock}
              data-ocid="admin.submit_button"
            >
              Unlock
            </Button>
          </div>
        </motion.div>
      </main>
    );
  }

  // Admin panel — no sign-in required, no backend required
  return (
    <main className="min-h-screen pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-start justify-between gap-4"
        >
          <div>
            <h1 className="font-editorial text-3xl font-semibold mb-1">
              Admin Panel
            </h1>
            <p className="font-body text-xs text-green-700 font-medium uppercase tracking-wide mt-1">
              {products.length} product{products.length !== 1 ? "s" : ""} in
              store
            </p>
          </div>

          <Button
            onClick={() => {
              setShowAddForm(true);
              setEditingProduct(null);
            }}
            className="shrink-0 font-body text-xs tracking-widest uppercase h-10 px-5"
            data-ocid="admin.primary_button"
          >
            <Plus size={14} className="mr-1.5" />
            Add Product
          </Button>
        </motion.div>

        {/* Add form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8"
            >
              <ProductForm
                title="Add New Product"
                onSubmit={handleAddProduct}
                onCancel={() => setShowAddForm(false)}
                isLoading={addProduct.isPending}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit form */}
        <AnimatePresence>
          {editingProduct && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8"
            >
              <ProductForm
                title={`Edit: ${editingProduct.name}`}
                initial={{
                  name: editingProduct.name,
                  description: editingProduct.description,
                  price: (Number(editingProduct.price) / 100).toFixed(2),
                  category: editingProduct.category,
                  imageUrl: editingProduct.imageUrl ?? "",
                }}
                onSubmit={handleEditProduct}
                onCancel={() => setEditingProduct(null)}
                isLoading={updateProduct.isPending}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products table */}
        <div className="border border-border overflow-auto">
          <Table data-ocid="admin.table">
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead className="font-body text-xs tracking-widest uppercase">
                  Image
                </TableHead>
                <TableHead className="font-body text-xs tracking-widest uppercase">
                  Name
                </TableHead>
                <TableHead className="font-body text-xs tracking-widest uppercase">
                  Category
                </TableHead>
                <TableHead className="font-body text-xs tracking-widest uppercase">
                  Price
                </TableHead>
                <TableHead className="font-body text-xs tracking-widest uppercase text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-12 font-body text-muted-foreground"
                    data-ocid="admin.empty_state"
                  >
                    No products yet. Add your first product above.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product, index) => (
                  <TableRow
                    key={product.id.toString()}
                    data-ocid={`admin.item.${index + 1}`}
                  >
                    <TableCell>
                      <div className="w-12 h-12 overflow-hidden bg-secondary shrink-0">
                        <img
                          src={
                            product.imageUrl ||
                            getCategoryPlaceholder(product.category)
                          }
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              getCategoryPlaceholder(product.category);
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-body text-sm font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="font-body text-xs tracking-wide uppercase"
                      >
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-body text-sm font-semibold">
                      {formatPrice(product.price)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingProduct(product);
                            setShowAddForm(false);
                          }}
                          className="font-body text-xs tracking-wide uppercase"
                          data-ocid={`admin.edit_button.${index + 1}`}
                        >
                          <Edit2 size={14} className="mr-1.5" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product)}
                          className="font-body text-xs tracking-wide uppercase text-destructive hover:text-destructive"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}
