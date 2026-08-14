import { createHash } from "node:crypto";

import type { FiscalRecordChainLink, FiscalRecordType } from "@/types/fiscal";

export type AltaHashInput = {
  issuerNif: string;
  invoiceNumber: string;
  issuedAt: string;
  invoiceType: string;
  totalTax: number;
  totalAmount: number;
  previousHash?: string | null;
  generatedAt: string;
};

export type AnulacionHashInput = {
  issuerNif: string;
  invoiceNumber: string;
  issuedAt: string;
  previousHash?: string | null;
  generatedAt: string;
};

function formatAmount(value: number): string {
  return value.toFixed(2);
}

function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex").toUpperCase();
}

/**
 * Builds the canonical input used by the AEAT hash specification for a
 * registration of type Alta. Keep this function deliberately small and
 * deterministic: the exact string is part of the fiscal integrity model.
 */
export function buildAltaHashInput(input: AltaHashInput): string {
  return [
    `NIF=${input.issuerNif}`,
    `NumSerieFactura=${input.invoiceNumber}`,
    `FechaExpedicionFactura=${input.issuedAt}`,
    `TipoFactura=${input.invoiceType}`,
    `CuotaTotal=${formatAmount(input.totalTax)}`,
    `ImporteTotal=${formatAmount(input.totalAmount)}`,
    `Huella=${input.previousHash ?? ""}`,
    `FechaHoraHusoGenRegistro=${input.generatedAt}`,
  ].join("&");
}

export function buildAnulacionHashInput(input: AnulacionHashInput): string {
  return [
    `NIF=${input.issuerNif}`,
    `NumSerieFactura=${input.invoiceNumber}`,
    `FechaExpedicionFactura=${input.issuedAt}`,
    `Huella=${input.previousHash ?? ""}`,
    `FechaHoraHusoGenRegistro=${input.generatedAt}`,
  ].join("&");
}

export function calculateFiscalHash(
  recordType: FiscalRecordType,
  input: AltaHashInput | AnulacionHashInput,
): string {
  const canonical =
    recordType === "alta"
      ? buildAltaHashInput(input as AltaHashInput)
      : buildAnulacionHashInput(input as AnulacionHashInput);

  return sha256(canonical);
}

export function toChainLink(
  issuerNif: string,
  invoiceNumber: string,
  issuedAt: string,
  hash: string,
): FiscalRecordChainLink {
  return { issuerNif, invoiceNumber, issuedAt, hash };
}
