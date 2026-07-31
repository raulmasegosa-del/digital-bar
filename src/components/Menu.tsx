import { getFullMenu } from "@/lib/db/fullMenu";

export default async function Menu() {
  const menu = await getFullMenu();
  console.log(JSON.stringify(menu, null, 2));

  return (
    <div className="space-y-10">
      {menu.map((category) => (
        <section key={category.id}>
          <h2 className="text-3xl font-bold text-amber-700 mb-4">
            {category.name}
          </h2>

{category.items.map((item: any) => (            <div
              key={item.id}
              className="border-b py-4"
            >
              <div className="flex justify-between">
                <h3 className="font-semibold">{item.name}</h3>

                <span>
                  {item.prices[0]?.price} €
                </span>
              </div>

              {item.description && (
                <p className="text-sm text-gray-500">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}