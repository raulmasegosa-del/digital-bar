import { getFullMenu } from "@/lib/db/fullMenu";
import CategoryNavigation from "@/components/CategoryNavigation";
import MenuClient from "./MenuClient";

export default async function Menu() {
  const menu = await getFullMenu();

  return (
    <>
      <CategoryNavigation categories={menu} />

      <MenuClient menu={menu} />
    </>
  );
}