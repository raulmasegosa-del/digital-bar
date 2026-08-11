import Link from "next/link";

import { FolderOpen, Pencil } from "lucide-react";

import DeleteCategoryButton from "./DeleteCategoryButton";

type Category = {
  id: string;
  name: string;
};

type Props = {
  category: Category;
  slug: string;
  restaurantId: string;
  productCount?: number;
};

export default function CategoryCard({
  category,
  slug,
  restaurantId,
  productCount = 0,
}: Props) {
  return (
    <div className="group rounded-2xl border border-zinc-800 bg-[#181716] p-5 text-white shadow-sm transition-colors duration-150 hover:border-zinc-700 hover:bg-[#1c1a18]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Link
            href={`/admin/${slug}/categories/${category.id}`}
            className="block truncate text-base font-medium text-white transition-colors hover:text-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
          >
            {category.name || "Sin nombre"}
          </Link>

          <p className="mt-1 text-sm text-zinc-500">
            {productCount === 1 ? "1 producto" : `${productCount} productos`}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 text-amber-400">
          <FolderOpen size={20} strokeWidth={1.7} />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <Link
          href={`/admin/${slug}/categories/${category.id}`}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 text-sm font-medium text-white transition-colors hover:bg-amber-500 active:scale-[0.99]"
        >
          <Pencil size={16} strokeWidth={1.8} />
          Editar
        </Link>

        <DeleteCategoryButton
          id={category.id}
          slug={slug}
          restaurantId={restaurantId}
          name={category.name || "Sin nombre"}
        />
      </div>
    </div>
  );
}
