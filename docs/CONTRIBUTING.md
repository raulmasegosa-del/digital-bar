# Contributing to Digital Bar

¡Gracias por contribuir a Digital Bar!

El objetivo del proyecto es construir una plataforma moderna para la gestión digital de restaurantes utilizando Next.js, Supabase y TypeScript.

Este documento describe cómo trabajar en el proyecto para mantener un código consistente y fácil de mantener.

---

# Filosofía

Cada cambio debe cumplir estos principios:

- Simplicidad.
- Reutilización.
- Código limpio.
- Tipado estricto.
- Arquitectura consistente.
- Proyecto siempre desplegable.

---

# Flujo de trabajo

Cada funcionalidad seguirá este proceso.

## 1. Analizar

Antes de escribir código:

- ¿Existe ya una solución?
- ¿Hay un componente reutilizable?
- ¿Hay un tipo similar?

Evitar duplicar código.

---

## 2. Implementar

Desarrollar únicamente una funcionalidad por vez.

Los cambios deben ser pequeños.

---

## 3. Compilar

Siempre ejecutar:

```bash
npm run build
```

No se aceptan commits con errores de TypeScript.

---

## 4. Probar

Comprobar:

- Funcionamiento en localhost
- Sin errores en consola
- Sin errores TypeScript

---

## 5. Deploy

Subir los cambios:

```bash
git add .
git commit -m "Descripción clara"
git push
```

Esperar al despliegue automático en Vercel.

Verificar que la aplicación funciona correctamente.

---

## 6. Documentar

Actualizar cuando sea necesario:

- CHANGELOG.md
- ROADMAP.md
- ARCHITECTURE.md

---

# Mensajes de commit

Utilizar mensajes claros.

Correcto:

```text
Añadido panel de configuración

Mejorado carrito

Refactor de Product

Corregido envío por WhatsApp
```

Evitar:

```text
Cambios

Update

Arreglos

Prueba
```

---

# Organización del proyecto

Cada entidad tiene:

- Tipos
- Acceso a datos
- Componentes
- Acciones

Ejemplo:

```
Product

types/product.ts

lib/db/products.ts

lib/actions/products.ts

components/product/
```

---

# Server Components

Siempre serán la opción por defecto.

Solo utilizar Client Components cuando sea imprescindible.

---

# Acceso a datos

Nunca acceder directamente a Supabase desde un componente.

Siempre:

```
Component

↓

lib/db

↓

Supabase
```

---

# Server Actions

Todas las escrituras utilizan Server Actions.

Nunca modificar la base de datos directamente desde un componente.

---

# Tipos

Cada entidad tiene un único tipo principal.

Ejemplo:

```
Product

Category

Order

RestaurantSettings
```

Evitar múltiples tipos para representar el mismo modelo.

---

# Componentes

Los componentes deben tener una única responsabilidad.

Si un componente crece demasiado:

Dividirlo.

---

# Nombres

Utilizar nombres descriptivos.

Correcto:

```ts
product

category

order

restaurantSettings
```

Evitar:

```ts
item

data

obj

row
```

---

# Calidad

Antes de hacer un commit comprobar:

✅ Compila.

✅ Sin errores TypeScript.

✅ Sin warnings importantes.

✅ Funciona en local.

✅ Funciona en producción.

---

# Checklist antes de Merge

- [ ] npm run build
- [ ] Tipos correctos
- [ ] Componentes reutilizados
- [ ] Arquitectura respetada
- [ ] Sin código duplicado
- [ ] Documentación actualizada
- [ ] Deploy correcto en Vercel

---

# Objetivo

Mantener una única base de código capaz de adaptarse a cualquier restaurante mediante configuración.

Toda la personalización debe realizarse desde:

restaurant_settings

Nunca modificando el código fuente.

---

# Regla de oro

Cada cambio debe dejar el proyecto en un estado mejor que el anterior.

El código no solo debe funcionar hoy.

Debe ser fácil de entender y mantener dentro de un año.