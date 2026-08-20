import https from "node:https";
import fs from "node:fs";

/**
 * Transport boundary for the AEAT VERI*FACTU test service.
 *
 * The endpoint is taken from AEAT's current test WSDL. Credentials are never
 * committed and submission remains disabled until the certificate is supplied.
 */
export const AEAT_TEST_VERIFACTU_ENDPOINT =
  "https://prewww1.aeat.es/wlpl/TIKE-CONT/ws/SistemaFacturacion/VerifactuSOAP";

const SOAP_ENV = "http://schemas.xmlsoap.org/soap/envelope/";

export type AeatTestClientConfig = {
  endpoint: string;
  pfxPath: string;
  pfxPassphrase: string;
  caPath?: string;
  timeoutMs?: number;
};

export type AeatSubmissionResult = {
  httpStatus: number;
  contentType: string | undefined;
  body: string;
};

export function buildSoap11Envelope(xmlBody: string) {
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<soapenv:Envelope xmlns:soapenv="${SOAP_ENV}">` +
    `<soapenv:Header/>` +
    `<soapenv:Body>${xmlBody}</soapenv:Body>` +
    `</soapenv:Envelope>`
  );
}

/**
 * Wraps the document/literal operation expected by the AEAT WSDL.
 */
export function buildAeatRequestBody(args: {
  operationNamespace: string;
  operationName: string;
  registroFacturacionXml: string;
}) {
  return `<v:${args.operationName} xmlns:v="${args.operationNamespace}">${args.registroFacturacionXml}</v:${args.operationName}>`;
}

export async function submitAeatTest(
  config: AeatTestClientConfig,
  soapBody: string,
): Promise<AeatSubmissionResult> {
  const url = new URL(config.endpoint);
  const body = buildSoap11Envelope(soapBody);
  const pfx = fs.readFileSync(config.pfxPath);
  const ca = config.caPath ? fs.readFileSync(config.caPath) : undefined;

  return await new Promise((resolve, reject) => {
    const request = https.request(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || 443,
        path: `${url.pathname}${url.search}`,
        method: "POST",
        pfx,
        passphrase: config.pfxPassphrase,
        ca,
        rejectUnauthorized: true,
        timeout: config.timeoutMs ?? 30_000,
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
          Accept: "text/xml, application/xml",
          SOAPAction: '""',
          "Content-Length": Buffer.byteLength(body, "utf8"),
        },
      },
      (response) => {
        const chunks: Buffer[] = [];
        response.on("data", (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
        response.on("end", () => {
          resolve({
            httpStatus: response.statusCode ?? 0,
            contentType: response.headers["content-type"],
            body: Buffer.concat(chunks).toString("utf8"),
          });
        });
      },
    );

    request.on("timeout", () => request.destroy(new Error("AEAT test request timed out")));
    request.on("error", reject);
    request.write(body, "utf8");
    request.end();
  });
}

export function validateAeatTestConfig(config: Partial<AeatTestClientConfig>) {
  const missing: string[] = [];
  if (!config.endpoint) missing.push("AEAT_TEST_ENDPOINT");
  if (!config.pfxPath) missing.push("AEAT_TEST_CERT_PFX_PATH");
  if (!config.pfxPassphrase) missing.push("AEAT_TEST_CERT_PFX_PASSPHRASE");
  return { ok: missing.length === 0, missing };
}
