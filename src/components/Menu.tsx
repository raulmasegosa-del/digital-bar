import { getFullMenu } from "@/lib/db/fullMenu";
import CategoryNavigation from "@/components/CategoryNavigation";
import MenuClient from "./MenuClient";
import { debug } from "@/lib/debug";

export default async function Menu() {
  const menu = await getFullMenu();

 if (process.env.NODE_ENV === "development") {
 debug(
  "Categorías:",
  menu.length,
  "Productos:",
  menu.reduce((n, c) => n + c.items.length, 0)
);
}

  return (
    <>
      <CategoryNavigation categories={menu} />
      <MenuClient menu={menu} />
    </>
  );
}