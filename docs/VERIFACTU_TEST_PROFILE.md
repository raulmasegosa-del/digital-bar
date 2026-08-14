# VERI*FACTU — perfil de pruebas de DIGITAL BAR

Este perfil utiliza exclusivamente datos fiscales ficticios. No representa a ningún obligado tributario real y no debe utilizarse para emitir facturas reales.

## Datos de prueba

- Nombre fiscal: `DIGITAL BAR TEST`
- NIF: `B00000000`
- Dirección: `Calle de Pruebas 1`
- Código postal: `08001`
- Ciudad: `Barcelona`
- Provincia: `Barcelona`
- País: `ES`
- Serie inicial: `T`
- Primera numeración: `T-000001`
- Modalidad objetivo: `VERI*FACTU`
- Envío AEAT: desactivado durante desarrollo

## Regla de seguridad

Mientras este perfil esté activo, el sistema debe permanecer en modo `test` y no debe realizar ningún envío a la AEAT.

## Próximo paso

Construir el modelo persistente de facturas y registros de facturación, manteniendo separados:

1. pedido y cobro;
2. factura emitida;
3. registro de facturación VERI*FACTU;
4. envío/respuesta de AEAT.

La implementación final del hash deberá seguir exactamente las especificaciones técnicas vigentes de la AEAT. La AEAT indica que todos los registros de facturación de alta y anulación llevan huella SHA-256 y que la huella anterior participa en el encadenamiento de registros.
