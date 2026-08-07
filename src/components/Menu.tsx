import { getFullMenu } from "@/lib/db/fullMenu";
import CategoryNavigation from "@/components/CategoryNavigation";
import MenuClient from "./MenuClient";

export default async function Menu() {
 const menu = await getFullMenu();

console.log(
  "Categorías:", menu.length,
  "Productos:",
  menu.reduce((n, c) => n + c.items.length, 0)
);
}