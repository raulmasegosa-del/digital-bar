import { buildRegistroAltaXml } from "../src/lib/fiscal/aeatRegistroAlta";

const xml = buildRegistroAltaXml({
  issuerNif: "B12345678",
  issuerName: "DIGITAL BAR PRUEBAS, S.L.",
  invoiceNumber: "T-TEST-000001",
  issueDate: "2026-08-20",
  invoiceType: "F2",
  operationDescription: "Servicios de hostelería y restauración",
  taxBreakdown: [
    {
      regime: "01",
      qualification: "S1",
      rate: 10,
      base: 10,
      tax: 1,
    },
  ],
  totalTax: 1,
  totalAmount: 11,
  sif: {
    producerName: "DIGITAL BAR PRUEBAS, S.L.",
    producerNif: "B12345678",
    name: "DIGITAL BAR",
    identifier: "DB",
    version: "0.1.0-test",
    installationId: "DIGITAL-BAR-TEST-01",
    onlyVerifactu: true,
    multiOt: false,
    multipleOtIndicator: false,
  },
  generatedAt: "2026-08-20T16:00:00+02:00",
  hash: "A".repeat(64),
});

const required = [
  "<sum:RegFactuSistemaFacturacion",
  "<sum:Cabecera>",
  "<sum1:ObligadoEmision>",
  "<sum:RegistroFactura>",
  "<sum1:RegistroAlta>",
  "<sum1:IDVersion>1.0</sum1:IDVersion>",
  "<sum1:TipoFactura>F2</sum1:TipoFactura>",
  "<sum1:DetalleDesglose>",
  "<sum1:ClaveRegimen>01</sum1:ClaveRegimen>",
  "<sum1:CalificacionOperacion>S1</sum1:CalificacionOperacion>",
  "<sum1:TipoImpositivo>10.00</sum1:TipoImpositivo>",
  "<sum1:Encadenamiento>",
  "<sum1:PrimerRegistro>S</sum1:PrimerRegistro>",
  "<sum1:IdSistemaInformatico>DB</sum1:IdSistemaInformatico>",
  "<sum1:TipoHuella>01</sum1:TipoHuella>",
];

for (const fragment of required) {
  if (!xml.includes(fragment)) throw new Error(`Falta en RegistroAlta: ${fragment}`);
}

if (!/<sum1:Huella>A{64}<\/sum1:Huella>/.test(xml)) {
  throw new Error("La huella no tiene 64 caracteres SHA-256");
}

if (xml.includes("DIGITAL-BAR</sum1:IdSistemaInformatico>")) {
  throw new Error("IdSistemaInformatico supera el máximo de 2 caracteres");
}

console.log("AEAT RegistroAlta offline contract check: OK");
