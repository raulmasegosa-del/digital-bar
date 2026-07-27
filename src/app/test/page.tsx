import { getCategories } from "@/lib/db/menu";

export default async function TestPage() {
  const categories = await getCategories();

  return (
    <main className="p-10">
      <pre>
        {JSON.stringify(categories, null, 2)}
      </pre>
    </main>
  );
}