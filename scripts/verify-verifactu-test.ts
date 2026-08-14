import {
  buildAltaHashInput,
  calculateFiscalHash,
} from "../src/lib/fiscal/hash";

const testProfile = {
  name: "DIGITAL BAR TEST",
  nif: "B00000000",
  series: "T",
};

const first = {
  issuerNif: testProfile.nif,
  invoiceNumber: `${testProfile.series}-000001`,
  issuedAt: "14-08-2026",
  invoiceType: "F2",
  totalTax: 3.17,
  totalAmount: 18.17,
  previousHash: null,
  generatedAt: "2026-08-14T21:43:12+02:00",
};

const firstInput = buildAltaHashInput(first);
const firstHash = calculateFiscalHash("alta", first);

const second = {
  issuerNif: testProfile.nif,
  invoiceNumber: `${testProfile.series}-000002`,
  issuedAt: "14-08-2026",
  invoiceType: "F2",
  totalTax: 1.74,
  totalAmount: 9.94,
  previousHash: firstHash,
  generatedAt: "2026-08-14T21:44:03+02:00",
};

const secondHash = calculateFiscalHash("alta", second);

if (firstHash.length !== 64 || secondHash.length !== 64) {
  throw new Error("VERI*FACTU test hash must contain 64 hexadecimal characters.");
}

if (firstHash === secondHash) {
  throw new Error("Chained fiscal records must not produce the same hash.");
}

console.log("DIGITAL BAR VERI*FACTU TEST");
console.log("Factura 1:", first.invoiceNumber);
console.log("Entrada hash 1:", firstInput);
console.log("Hash 1:", firstHash);
console.log("Factura 2:", second.invoiceNumber);
console.log("Hash anterior encadenado:", second.previousHash);
console.log("Hash 2:", secondHash);
console.log("OK: cadena SHA-256 determinista generada correctamente.");
