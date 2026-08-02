import OptionItemForm from "@/components/admin/OptionItemForm";
import { getOptionGroups } from "@/lib/db/admin";

export const dynamic = "force-dynamic";

export default async function NewOptionPage() {
  const groups = await getOptionGroups();

  return (
    <main className="min-h-screen bg-amber-50 p-6">
      <div className="mx-auto max-w-2xl">
        <OptionItemForm groups={groups} />
      </div>
    </main>
  );
}