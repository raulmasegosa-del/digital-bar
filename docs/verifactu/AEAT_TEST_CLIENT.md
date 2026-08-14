# VERI*FACTU — AEAT test client

## Scope

This branch prepares the transport boundary for the AEAT VERI*FACTU external test environment. It does **not** submit anything yet and contains no certificate or private key.

AEAT's current technical documentation specifies HTTPS, SOAP 1.1, document/literal XML, UTF-8 and a qualified electronic certificate for applications sending records to the web service.

## Required secrets

Configure these only as Vercel/server-side environment secrets when the exact WSDL endpoint and operation contract have been verified:

- `AEAT_TEST_ENDPOINT`
- `AEAT_TEST_OPERATION_NAMESPACE`
- `AEAT_TEST_OPERATION_NAME`
- `AEAT_TEST_CERT_PFX_PATH`
- `AEAT_TEST_CERT_PFX_PASSPHRASE`

Never commit a `.pfx`, private key, certificate password, or other credential to Git.

## Activation gate

Before enabling a real call, verify against the current AEAT-published WSDL/XSD:

1. exact test endpoint;
2. SOAP operation name and namespace;
3. `RegistroFacturacion` request wrapper;
4. current `RegistroAlta` XSD structure;
5. current validation rules;
6. certificate accepted by the test environment.

The transport module intentionally requires the endpoint and operation contract to be supplied explicitly so the application cannot silently guess a stale AEAT endpoint.
