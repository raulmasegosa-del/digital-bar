const SOAP_ENV_NS = "http://schemas.xmlsoap.org/soap/envelope/";
const SUM_NS = "https://www2.agenciatributaria.gob.es/static_files/common/internet/dep/aplicaciones/es/aeat/tike/cont/ws/SuministroLR.xsd";
const SUM1_NS = "https://www2.agenciatributaria.gob.es/static_files/common/internet/dep/aplicaciones/es/aeat/tike/cont/ws/SuministroInformacion.xsd";

export const AEAT_TEST_WSDL = "https://prewww2.aeat.es/static_files/common/internet/dep/aplicaciones/es/aeat/tikeV1.0/cont/ws/SistemaFacturacion.wsdl";
export const AEAT_TEST_SUPPLY_XSD = "https://prewww2.aeat.es/static_files/common/internet/dep/aplicaciones/es/aeat/tikeV1.0/cont/ws/SuministroLR.xsd";

export type AeatTaxBreakdown = {
  regime: string;
  qualification: string;
  rate: number;
  base: number;
  tax: number;
};

export type AeatAltaInput = {
  issuerNif: string;
  issuerName: string;
  invoiceNumber: string;
  issueDate: string;
  invoiceType: string;
  operationDescription: string;
  taxBreakdown: AeatTaxBreakdown[];
  totalTax: number;
  totalAmount: number;
  previous?: {
    issuerNif: string;
    invoiceNumber: string;
    issueDate: string;
    hash: string;
  };
  sif: {
    producerName: string;
    producerNif: string;
    name: string;
    identifier: string;
    version: string;
    installationId: string;
    onlyVerifactu: boolean;
    multiOt: boolean;
    multipleOtIndicator: boolean;
  };
  generatedAt: string;
  hash: string;
};

function xml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function tag(name: string, value: string) {
  return `<sum1:${name}>${xml(value)}</sum1:${name}>`;
}

function money(value: number) {
  return String(value);
}

function dateDDMMYYYY(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) throw new Error(`Fecha AEAT no válida: ${value}`);
  return `${match[3]}-${match[2]}-${match[1]}`;
}

function boolFlag(value: boolean) {
  return value ? "S" : "N";
}

/**
 * Serializes the current AEAT 1.0 RegistroAlta contract documented by AEAT.
 * This is deliberately a pure function: it does not send anything to AEAT.
 */
export function buildRegistroAltaXml(input: AeatAltaInput) {
  const breakdown = input.taxBreakdown
    .map(
      (row) =>
        `<sum1:DetalleDesglose>` +
        tag("ClaveRegimen", row.regime) +
        tag("CalificacionOperacion", row.qualification) +
        tag("TipoImpositivo", money(row.rate)) +
        tag("BaseImponibleOimporteNoSujeto", money(row.base)) +
        tag("CuotaRepercutida", money(row.tax)) +
        `</sum1:DetalleDesglose>`,
    )
    .join("");

  const previous = input.previous
    ? `<sum1:RegistroAnterior>` +
      tag("IDEmisorFactura", input.previous.issuerNif) +
      tag("NumSerieFactura", input.previous.invoiceNumber) +
      tag("FechaExpedicionFactura", dateDDMMYYYY(input.previous.issueDate)) +
      tag("Huella", input.previous.hash) +
      `</sum1:RegistroAnterior>`
    : `<sum1:PrimerRegistro>S</sum1:PrimerRegistro>`;

  const registro =
    `<sum1:RegistroAlta>` +
    tag("IDVersion", "1.0") +
    `<sum1:IDFactura>` +
    tag("IDEmisorFactura", input.issuerNif) +
    tag("NumSerieFactura", input.invoiceNumber) +
    tag("FechaExpedicionFactura", dateDDMMYYYY(input.issueDate)) +
    `</sum1:IDFactura>` +
    tag("NombreRazonEmisor", input.issuerName) +
    tag("TipoFactura", input.invoiceType) +
    tag("DescripcionOperacion", input.operationDescription) +
    `<sum1:Desglose>${breakdown}</sum1:Desglose>` +
    tag("CuotaTotal", money(input.totalTax)) +
    tag("ImporteTotal", money(input.totalAmount)) +
    `<sum1:Encadenamiento>${previous}</sum1:Encadenamiento>` +
    `<sum1:SistemaInformatico>` +
    tag("NombreRazon", input.sif.producerName) +
    tag("NIF", input.sif.producerNif) +
    tag("NombreSistemaInformatico", input.sif.name) +
    tag("IdSistemaInformatico", input.sif.identifier) +
    tag("Version", input.sif.version) +
    tag("NumeroInstalacion", input.sif.installationId) +
    tag("TipoUsoPosibleSoloVerifactu", boolFlag(input.sif.onlyVerifactu)) +
    tag("TipoUsoPosibleMultiOT", boolFlag(input.sif.multiOt)) +
    tag("IndicadorMultiplesOT", boolFlag(input.sif.multipleOtIndicator)) +
    `</sum1:SistemaInformatico>` +
    tag("FechaHoraHusoGenRegistro", input.generatedAt) +
    tag("TipoHuella", "01") +
    tag("Huella", input.hash) +
    `</sum1:RegistroAlta>`;

  return (
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<soapenv:Envelope xmlns:soapenv="${SOAP_ENV_NS}" xmlns:sum="${SUM_NS}" xmlns:sum1="${SUM1_NS}">` +
    `<soapenv:Header/>` +
    `<soapenv:Body>` +
    `<sum:RegFactuSistemaFacturacion>` +
    `<sum:Cabecera><sum1:ObligadoEmision>` +
    tag("NombreRazon", input.issuerName) +
    tag("NIF", input.issuerNif) +
    `</sum1:ObligadoEmision></sum:Cabecera>` +
    `<sum:RegistroFactura>${registro}</sum:RegistroFactura>` +
    `</sum:RegFactuSistemaFacturacion>` +
    `</soapenv:Body>` +
    `</soapenv:Envelope>`
  );
}
