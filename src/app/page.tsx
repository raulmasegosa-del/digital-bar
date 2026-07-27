import Header from "@/components/Header";
import CategoryNavigation from "@/components/CategoryNavigation";
import CategorySection from "@/components/CategorySection";
import { categories, items } from "@/data";
export default function Home() {
  return (
    <main className="min-h-screen bg-amber-50 p-6">
      <div className="mx-auto max-w-4xl">
        <Header />

        <CategoryNavigation />

        {categories.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
          />
        ))}
      </div>
    </main>
  );
}