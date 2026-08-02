import OptionItemForm from "@/components/admin/OptionItemForm";
import {
  getOptionGroups,
  getOptionItem,
} from "@/lib/db/admin";

export const dynamic = "force-dynamic";

export default async function EditOptionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const item = await getOptionItem(id);

  if (!item) {
    return (
      <main className="min-h-screen bg-amber-50 p-6">
        <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow">
          <h1 className="text-2xl font-bold">
            Opción no encontrada
          </h1>
        </div>
      </main>
    );
  }

  const groups = await getOptionGroups();

  return (
    <main className="min-h-screen bg-amber-50 p-6">
      <div className="mx-auto max-w-2xl">
        <OptionItemForm
          item={item}
          groups={groups}
        />
      </div>
    </main>
  );
}