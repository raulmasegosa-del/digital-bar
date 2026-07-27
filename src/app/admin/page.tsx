import ProductTable from "@/components/admin/ProductTable";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-amber-50 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-4xl font-bold text-amber-700">
          Panel de administración
        </h1>

        <ProductTable />
      </div>
    </main>
  );
}