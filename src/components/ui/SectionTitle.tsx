import { MenuCategory } from "@/types/menu";

type SectionTitleProps = {
  category: MenuCategory;
};

export default function SectionTitle({ category }: SectionTitleProps) {
  return (
    <div className="mb-6 mt-10">
      <h2 className="flex items-center gap-3 text-2xl font-bold text-amber-800">
        <span className="text-3xl">
          {category.icon}
        </span>

        {category.name}
      </h2>

      <div className="mt-2 h-px bg-amber-200" />
    </div>
  );
}