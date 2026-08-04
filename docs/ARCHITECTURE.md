# Digital Bar - Arquitectura

## Filosofía

Digital Bar está diseñado como una aplicación reutilizable para cualquier restaurante.

Los principios del proyecto son:

- Server Components por defecto.
- Client Components únicamente cuando sean necesarios.
- Server Actions para todas las escrituras.
- Supabase como única fuente de datos.
- TypeScript estricto.
- Componentes pequeños y reutilizables.
- Arquitectura orientada al dominio.
- Código mantenible y escalable.

---

# Objetivo

Construir una única aplicación capaz de adaptarse a cualquier restaurante mediante configuración, sin modificar el código fuente.

Toda la personalización debe realizarse desde:

restaurant_settings

---

# Entidades del dominio

Las entidades principales del sistema son:

- Restaurant
- Category
- Product
- OptionGroup
- OptionItem
- Order
- Cart
- Table

Cada entidad dispone de:

- tipos TypeScript
- acceso a datos
- acciones
- componentes específicos cuando sea necesario

---

# Estructura del proyecto

src/

    app/
        Rutas de Next.js

    components/
        Componentes reutilizables

        admin/
            Panel de administración

        menu/
            Carta pública

        kitchen/
            Panel de cocina

        ui/
            Componentes genéricos

    context/
        Estado global

    lib/

        db/
            Acceso a Supabase

        actions/
            Server Actions

        services/
            Lógica de negocio compartida

        supabase/
            Clientes Supabase

    types/
        Tipos TypeScript por entidad

---

# Flujo de datos

Supabase

↓

lib/db

↓

Server Actions

↓

Server Components

↓

Client Components

Los componentes nunca accederán directamente a Supabase.

---

# Organización por capas

## Types

Contienen exclusivamente modelos de datos.

Ejemplo:

Product

Category

Order

RestaurantSettings

---

## DB

Una tabla = un archivo.

Ejemplo:

lib/db/

products.ts

categories.ts

options.ts

orders.ts

settings.ts

---

## Actions

Todas las modificaciones de datos pasan por Server Actions.

Nunca escribir directamente en Supabase desde un componente.

---

## Components

Responsables únicamente de la interfaz.

No contienen acceso a datos.

No contienen lógica de negocio.

---

## Context

Solo para estado compartido entre componentes.

Actualmente:

- CartContext
- TableContext

---

# Convenciones

## Tipos

Cada entidad tiene un único tipo principal.

Ejemplo:

Product

Category

Order

RestaurantSettings

Las variantes se construirán sobre esos tipos.

Ejemplo:

ProductWithRelations

RestaurantSettingsInput

Nunca crear varios tipos distintos para representar la misma entidad sin una razón clara.

---

## Nombres

Las propiedades utilizan exactamente el mismo nombre que la base de datos.

Ejemplo:

status

accept_orders

category_id

featured

available

Evitar nombres diferentes para el mismo dato.

---

## Componentes

Prioridad:

1. Server Component
2. Client Component únicamente cuando exista:

- estado
- eventos
- efectos

---

## Acceso a datos

Nunca:

Componente → Supabase

Siempre:

Componente

↓

lib/db

↓

Supabase

---

# Estilo

- Tailwind CSS
- Lucide React
- Componentes pequeños
- Props tipadas
- Sin código duplicado
- Funciones simples

---

# Calidad

Antes de cada commit:

✓ npm run build

✓ Sin errores TypeScript

✓ Sin warnings importantes

✓ Deploy correcto en Vercel

---

# Flujo de trabajo

Nueva funcionalidad

↓

Build

↓

Deploy

↓

Commit

↓

Actualizar CHANGELOG

---

# Roadmap técnico

Sprint 0

- Consolidación de arquitectura
- Unificación de tipos
- Configuración del restaurante

Sprint 1

- Pedidos
- Panel de cocina
- Realtime

Sprint 2

- Estadísticas
- Gestión de empleados

Sprint 3

- Pagos
- PWA
- Multiidioma

---

# Principios

Antes de escribir código, preguntarse:

¿Existe ya un componente similar?

¿Existe ya un tipo para esta entidad?

¿Puede reutilizarse?

¿Sigue la arquitectura?

¿Compila correctamente?

Si la respuesta es "no", corregir primero la arquitectura.

---

# Objetivo final

Mantener una única base de código capaz de adaptarse a cualquier restaurante mediante configuración, evitando duplicación de código y facilitando el mantenimiento a largo plazo.