export type FiscalMode = "test" | "production";

export type FiscalInvoiceSeries = {
  series: string;
  next_number: number;
};

export type FiscalRestaurantProfile = {
  mode: FiscalMode;
  legal_name: string;
  tax_id: string;
  address: string;
  postal_code: string;
  city: string;
  province: string;
  country: string;
  default_series: FiscalInvoiceSeries;
  verifactu_enabled: boolean;
};

export type FiscalInvoiceLine = {
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  tax_base: number;
  tax_amount: number;
  total: number;
};

export type FiscalInvoice = {
  series: string;
  number: number;
  invoice_number: string;
  invoice_type: "F1" | "F2";
  issued_at: string;
  operation_date: string;
  issuer: Pick<FiscalRestaurantProfile, "legal_name" | "tax_id">;
  lines: FiscalInvoiceLine[];
  tax_base: number;
  tax_amount: number;
  total: number;
};
