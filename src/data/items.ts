import { MenuItem } from "@/types/menu";
export const items: MenuItem[] = [
  {
    id: "bacon-queso",
    categoryId: "bocadillos-calientes",
    image: "/images/menu/bacon-queso.jpg",
    name: "Bacon y queso",
    subtitle: "Bacó i formatge",
    description: "",

    prices: [
      {
        label: "",
        price: 6.0,
      },
    ],

    featured: false,
    available: true,
    order: 1,

    allergens: ["gluten"],
  },

  {
    id: "lomo-queso",
    categoryId: "bocadillos-calientes",

    name: "Lomo y queso",
    subtitle: "Llom i formatge",
    description: "",

    prices: [
      {
        label: "",
        price: 6.0,
      },
    ],

    featured: false,
    available: true,
    order: 2,

    allergens: ["gluten"],
  },
  {
  id: "pica-pollo",
  categoryId: "especialidades",

  name: "Pica Pollo",
  subtitle: "Especialidad dominicana",
  description: "Pollo frito crujiente.",

  prices: [
    {
      label: "4 piezas",
      price: 17,
    },
    {
      label: "6 piezas",
      price: 25,
    },
  ],

  featured: true,
  available: true,
  order: 1,

  allergens: [],
},
];