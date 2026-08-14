export const AEAT_TEST_CONFIG = {
  /**
   * Deliberately left empty until the exact current VERI*FACTU test WSDL
   * endpoint is selected from AEAT's published WSDL. Do not guess endpoints.
   */
  endpoint: process.env.AEAT_TEST_ENDPOINT ?? "",
  operationNamespace: process.env.AEAT_TEST_OPERATION_NAMESPACE ?? "",
  operationName: process.env.AEAT_TEST_OPERATION_NAME ?? "",
  certificatePath: process.env.AEAT_TEST_CERT_PFX_PATH ?? "",
  certificatePassphrase: process.env.AEAT_TEST_CERT_PFX_PASSPHRASE ?? "",
};

export function getAeatTestConfiguration() {
  return {
    endpoint: AEAT_TEST_CONFIG.endpoint,
    operationNamespace: AEAT_TEST_CONFIG.operationNamespace,
    operationName: AEAT_TEST_CONFIG.operationName,
    certificatePath: AEAT_TEST_CONFIG.certificatePath,
    hasCertificatePassphrase: Boolean(AEAT_TEST_CONFIG.certificatePassphrase),
  };
}
