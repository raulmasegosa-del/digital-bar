import Link from "next/link";

export default function EditPage() {
  return (
    <main className="min-h-screen bg-amber-50 p-6">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold">
          Selecciona un producto
        </h1>

        <p className="mt-3 text-gray-600">
          Debes acceder a esta página desde el listado de productos.
        </p>

        <Link
          href="/admin"
          className="mt-6 inline-block rounded-lg bg-amber-600 px-6 py-3 font-medium text-white hover:bg-amber-700"
        >
          Volver al panel
        </Link>
      </div>
    </main>
  );
}