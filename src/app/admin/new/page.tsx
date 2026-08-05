import PageHeader from "@/components/ui/PageHeader";

import ProductForm from "@/components/admin/ProductForm";

import {
  getCategories,
  getOptionGroups,
} from "@/lib/db/admin";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await getCategories();
  const optionGroups = await getOptionGroups();

  return (
    <main className="space-y-8">
      <PageHeader
        title="Nuevo producto"
        description="Añade un nuevo producto a la carta."
        backHref="/admin/products"
        backLabel="Productos"
      />

      <div className="mx-auto max-w-3xl">
        <ProductForm
          categories={categories}
          optionGroups={optionGroups}
        />
      </div>
    </main>
  );
}