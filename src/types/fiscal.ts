export type FiscalEnvironment = "test" | "production";

export type InvoiceType = "F1" | "F2";

export type FiscalRecordType = "alta" | "anulacion";

export type FiscalRecordStatus =
  | "pending"
  | "accepted"
  | "accepted_with_errors"
  | "rejected";

export type FiscalTaxBreakdown = {
  taxRate: number;
  taxableBase: number;
  taxAmount: number;
};

export type FiscalInvoiceItem = {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  taxableBase: number;
  taxAmount: number;
  total: number;
};

export type FiscalInvoice = {
  id: string;
  restaurantId: string;
  orderId: string | null;
  series: string;
  number: number;
  invoiceNumber: string;
  invoiceType: InvoiceType;
  issuedAt: string;
  issuerName: string;
  issuerNif: string;
  issuerAddress: string;
  items: FiscalInvoiceItem[];
  taxBreakdown: FiscalTaxBreakdown[];
  totalTax: number;
  totalAmount: number;
  status: "issued" | "annulled";
};

export type FiscalRecordChainLink = {
  issuerNif: string;
  invoiceNumber: string;
  issuedAt: string;
  hash: string;
};

export type FiscalRecord = {
  id: string;
  restaurantId: string;
  invoiceId: string;
  recordType: FiscalRecordType;
  issuerNif: string;
  invoiceNumber: string;
  issuedAt: string;
  invoiceType?: InvoiceType;
  totalTax?: number;
  totalAmount?: number;
  previousRecord: FiscalRecordChainLink | null;
  generatedAt: string;
  hashAlgorithm: "01";
  hash: string;
  status: FiscalRecordStatus;
  environment: FiscalEnvironment;
};

export type FiscalTestProfile = {
  name: string;
  nif: string;
  address: string;
  postalCode: string;
  city: string;
  province: string;
  country: "ES";
  series: string;
  nextInvoiceNumber: number;
  environment: "test";
  verifactuEnabled: false;
  aeatSubmissionEnabled: false;
};
