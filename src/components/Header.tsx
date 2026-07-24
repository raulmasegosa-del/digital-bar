import { barConfig } from "@/config";

export default function Header() {
  return (
    <header className="text-center py-10">
      <h1 className="text-5xl font-bold text-amber-800">
        🍻 {barConfig.name}
      </h1>

      <p className="mt-4 text-gray-600">
        {barConfig.slogan}
      </p>
    </header>
  );
}