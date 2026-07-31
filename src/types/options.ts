export interface OptionItemInput {
  name: string;
  extra_price: number;
  available: boolean;
}

export interface OptionGroupInput {
  name: string;
  description?: string;

  required: boolean;
  multiple: boolean;

  min_select: number;
  max_select: number;

  items: OptionItemInput[];
}

export interface ActionResult {
  success: boolean;
  message: string;
}