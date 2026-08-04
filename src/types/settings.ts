export interface RestaurantSettings {
  id: string;

  name: string;

  phone: string;

  whatsapp: string;

  email: string;

  address: string;

  description: string;

  logo: string;

  primary_color: string;

  accept_orders: boolean;

  created_at: string;

  updated_at: string;
  
}

export type RestaurantSettingsInput = Omit<
  RestaurantSettings,
  "id" | "created_at" | "updated_at"
>;