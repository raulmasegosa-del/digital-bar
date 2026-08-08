import { getFullMenu } from "@/lib/db/fullMenu";
import MenuClient from "./MenuClient";
import { debug } from "@/lib/debug";

export default async function Menu() {
  const menu = await getFullMenu();

  debug(
    "Categorías:",
    menu.length,
    "Productos:",
    menu.reduce(
      (n, c) => n + c.items.length,
      0
    )
  );

  return <MenuClient menu={menu} />;
}