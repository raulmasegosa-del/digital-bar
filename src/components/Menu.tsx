import { getFullMenu } from "@/lib/db/fullMenu";
import MenuClient from "./MenuClient";

export default async function Menu() {
  const menu = await getFullMenu();

  return <MenuClient menu={menu} />;
}