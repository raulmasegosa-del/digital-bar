# Decisiones de Arquitectura

## 2026-07-29

### Sistema de opciones

Decisión:
Los grupos de opciones son reutilizables y se relacionan con los productos mediante una tabla puente (`product_option_groups`).

Motivo:
Evita duplicar información y permite reutilizar grupos como "Refresco" o "Tipo de leche" en múltiples productos.

---

### Horario del negocio

Decisión:
No se aceptarán pedidos fuera del horario de apertura.

Motivo:
Evita errores operativos y pedidos cuando el establecimiento está cerrado.

---

### Componentes

Decisión:
Server Components por defecto. Client Components solo cuando haya estado o interacción.

Motivo:
Mejor rendimiento y menos JavaScript enviado al navegador.