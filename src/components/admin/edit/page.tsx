import ProductForm from "@/components/admin/ProductForm";
import { items } from "@/data";

export default function EditProductPage() {
  return (
    <main className="min-h-screen bg-amber-50 p-6">
      <div className="mx-auto max-w-2xl">
        <ProductForm item={items[0]} />
      </div>
    </main>
  );
}