import ProductForm from "@/components/admin/ProductForm";
import {
  getCategories,
  getOptionGroups,
} from "@/lib/db/admin";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await getCategories();
  const optionGroups = await getOptionGroups();
console.log("OPTION GROUPS:", optionGroups);
  return (
    <main className="min-h-screen bg-amber-50 p-6">
      <div className="mx-auto max-w-2xl">
        <ProductForm
          categories={categories}
          optionGroups={optionGroups}
        />
      </div>
    </main>
  );
}