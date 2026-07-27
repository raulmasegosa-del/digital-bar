import { categories } from "@/data";
export default function CategoryNavigation() {
  return (
    <nav className="sticky top-0 z-10 bg-amber-50 py-4">
      <div className="flex gap-3 overflow-x-auto">
        {categories.map((category) => (
          <a
            key={category.id}
            href={`#${category.id}`}
            className="whitespace-nowrap rounded-full bg-white px-4 py-2 shadow border hover:bg-amber-100 transition"
          >
            {category.icon} {category.name}
          </a>
        ))}
      </div>
    </nav>
  );
}