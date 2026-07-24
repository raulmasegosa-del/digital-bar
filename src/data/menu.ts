import { MenuCategory, MenuItem } from "@/types/menu";


export const categories: MenuCategory[] = [
  {
    id: "tapas",
    name: "Tapas",
    icon: "🍟",
  },
  {
    id: "bocadillos",
    name: "Bocadillos",
    icon: "🥪",
  },
  {
    id: "bebidas",
    name: "Bebidas",
    icon: "🥤",
  },
];

export const items: MenuItem[] = [
 {
  id: "bravas",
  categoryId: "tapas",
  name: "Patatas Bravas",
  description: "Patatas con salsa brava casera",
  price: 6.5,

  featured: true,
  available: true,

  tags: ["picante"],

  allergens: [],
},
{
  id: "lomo-queso",
  categoryId: "bocadillos",
  name: "Lomo con queso",
  description: "Pan crujiente, lomo y queso",
  price: 5.9,
  featured: false,
  available: false,

  allergens: ["gluten"],
},
  {
  id: "coca-cola",
  categoryId: "bebidas",
  name: "Coca-Cola",
  description: "33 cl",
  price: 2.3,
    featured: false,
    available: true,
},
];