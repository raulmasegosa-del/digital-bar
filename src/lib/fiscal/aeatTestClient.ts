import https from "node:https";
import fs from "node:fs";
import { XMLParser } from "fast-xml-parser";

/**
 * Transport boundary for the AEAT VERI*FACTU test service.
 *
 * This module deliberately does not contain credentials and does not submit
 * anything by itself. It prepares a SOAP 1.1 request and exposes a single
 * transport function so credentials can later be supplied as infrastructure
 * secrets (never committed to the repository).
 */

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
  parsed: unknown;
};

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function buildSoap11Envelope(xmlBody: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<soapenv:Envelope xmlns:soapenv="${SOAP_ENV}">` +
    `<soapenv:Body>${xmlBody}</soapenv:Body>` +
    `</soapenv:Envelope>`;
}

/**
 * Build the VERI*FACTU RegistroFacturacion request wrapper.
 *
 * The exact operation/body namespace and inner RegistroAlta XML must be taken
 * from the current AEAT WSDL/XSD before enabling submission. Keeping this
 * function explicit avoids silently guessing the contract.
 */
export function buildAeatRequestBody(args: {
  operationNamespace: string;
  operationName: string;
  registroFacturacionXml: string;
}) {
  const namespace = escapeXml(args.operationNamespace);
  return `<v:${escapeXml(args.operationName)} xmlns:v="${namespace}">${args.registroFacturacionXml}</v:${escapeXml(args.operationName)}>`;
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
          const responseBody = Buffer.concat(chunks).toString("utf8");
          let parsed: unknown = undefined;
          try {
            parsed = new XMLParser({ ignoreAttributes: false }).parse(responseBody);
          } catch {
            // Preserve the raw response; AEAT SOAP faults can still be useful.
          }
          resolve({
            httpStatus: response.statusCode ?? 0,
            contentType: response.headers["content-type"],
            body: responseBody,
            parsed,
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

/**
 * Validates the minimum infrastructure configuration without making a call.
 */
export function validateAeatTestConfig(config: Partial<AeatTestClientConfig>) {
  const missing: string[] = [];
  if (!config.endpoint) missing.push("AEAT_TEST_ENDPOINT");
  if (!config.pfxPath) missing.push("AEAT_TEST_CERT_PFX_PATH");
  if (!config.pfxPassphrase) missing.push("AEAT_TEST_CERT_PFX_PASSPHRASE");
  return { ok: missing.length === 0, missing };
}
