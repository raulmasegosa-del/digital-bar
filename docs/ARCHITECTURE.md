# Digital Bar - Arquitectura

## Filosofía

- Componentes reutilizables.
- Server Components por defecto.
- Client Components solo cuando sean necesarios.
- Server Actions para escritura.
- Supabase como única fuente de datos.

---

# Estructura

src/

app/
Rutas de Next.js

components/
Componentes reutilizables

components/admin/
Panel de administración

components/menu/
Carta pública

components/ui/
Componentes genéricos

lib/
Acceso a datos

lib/db/
Consultas a Supabase

types/
Tipos TypeScript

---

# Regla

Un componente no accederá directamente a Supabase.

Siempre utilizará funciones de:

src/lib/db/

---

# Server Actions

Todas las acciones irán en:

src/app/**/actions.ts

---

# Estilo

TailwindCSS

Lucide Icons

Tipografía limpia

Componentes pequeños

---

# Objetivo RC1

Un único código para cualquier bar.

Sin código específico por cliente.