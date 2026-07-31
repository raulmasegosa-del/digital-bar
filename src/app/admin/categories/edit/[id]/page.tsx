import CategoryForm from "@/components/admin/CategoryForm";
import { getCategory } from "@/lib/db/admin";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const category = await getCategory(id);

  if (!category) {
    notFound();
  }

  return <CategoryForm item={category} />;
}