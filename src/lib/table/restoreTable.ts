type Result = {
  table: string;
  restaurant: string;
};

const TABLE_KEY = "digital-bar-table";
const RESTAURANT_KEY = "digital-bar-restaurant";

export function restoreTable(): Result {
  const params = new URLSearchParams(
    window.location.search
  );

  const table =
    params.get("mesa") ??
    localStorage.getItem(TABLE_KEY) ??
    "";

  const restaurant =
    params.get("bar") ??
    localStorage.getItem(RESTAURANT_KEY) ??
    "";

  if (table) {
    localStorage.setItem(TABLE_KEY, table);
  }

  if (restaurant) {
    localStorage.setItem(
      RESTAURANT_KEY,
      restaurant
    );
  }

  return {
    table,
    restaurant,
  };
}