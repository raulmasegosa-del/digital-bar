import { categories } from "@/data";

export default function CategoryNavigation() {
  return (
    <nav className="sticky top-0 z-30 -mx-6 mb-8 border-b border-amber-200 bg-white/90 px-6 py-4 backdrop-blur-md">
      <div className="flex gap-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {categories.map((category) => (
          <a
            key={category.id}
            href={`#${category.id}`}
            className="flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-100 hover:shadow-md"
          >
            <span className="text-lg">{category.icon}</span>
            <span>{category.name}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}