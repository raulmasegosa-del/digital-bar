# Digital Bar - Coding Standards

## Objetivo

Mantener una base de código consistente, mantenible y fácil de ampliar.

Todos los cambios realizados en el proyecto deben seguir estas normas.

---

# Principios

- Simplicidad antes que complejidad.
- Reutilizar antes que duplicar.
- Componentes pequeños.
- Tipado estricto.
- Una responsabilidad por archivo.
- Código fácil de leer.

---

# Estructura de carpetas

src/

    app/
    components/
    context/
    lib/
    types/
    hooks/
    styles/

No crear nuevas carpetas sin una necesidad clara.

---

# Server Components

Siempre serán la opción por defecto.

Solo utilizar Client Components cuando exista:

- estado
- eventos
- useEffect
- acceso al navegador

Ejemplo:

```tsx
export default async function ProductsPage() {
    const products = await getProducts();

    return <ProductGrid products={products} />;
}
```

---

# Client Components

Todos los Client Components comenzarán con:

```tsx
"use client";
```

y únicamente contendrán lógica relacionada con la interfaz.

Nunca accederán directamente a Supabase.

---

# Acceso a datos

Nunca:

Componente

↓

Supabase

Siempre:

Componente

↓

lib/db

↓

Supabase

---

# Server Actions

Todas las modificaciones de datos utilizarán Server Actions.

Ubicación:

```
src/lib/actions/
```

Nomenclatura:

```
createProduct()

updateProduct()

deleteProduct()

saveRestaurantSettings()
```

Siempre verbos.

---

# Base de datos

Cada tabla tendrá un único archivo.

Ejemplo:

```
lib/db/

products.ts

categories.ts

orders.ts

options.ts

settings.ts
```

---

# Tipos

Cada entidad tendrá su propio archivo.

Ejemplo:

```
types/

product.ts

category.ts

order.ts

settings.ts
```

Nunca definir interfaces grandes dentro de componentes.

---

# Nombres

Variables descriptivas.

Correcto:

```ts
product

category

restaurant

order

optionGroup
```

Evitar:

```ts
item

data

obj

row

value
```

---

# Props

Interfaces siempre tipadas.

```tsx
type Props = {
    product: Product;
};
```

No utilizar:

```tsx
props: any
```

---

# Imports

Orden obligatorio.

1.

Librerías externas

```ts
import { useState } from "react";
```

2.

Next.js

```ts
import Link from "next/link";
```

3.

Componentes

```ts
import ProductCard from "...";
```

4.

Lib

```ts
import { getProducts } from "...";
```

5.

Types

```ts
import type { Product } from "...";
```

---

# Componentes

Un componente debe hacer una única cosa.

Si supera aproximadamente las 200 líneas, valorar dividirlo.

---

# Funciones

Las funciones deben ser pequeñas.

Preferiblemente:

20–40 líneas.

Extraer lógica repetida.

---

# Tailwind

Agrupar clases por bloques.

Ejemplo:

```tsx
className="
flex
items-center
justify-between
rounded-xl
bg-white
p-6
shadow
"
```

Mantener un orden consistente.

---

# Estados

Utilizar nombres claros.

Correcto:

```ts
loading

selectedProduct

currentStatus

isOpen
```

Evitar:

```ts
a

temp

state

value
```

---

# Context

Solo almacenar estado compartido.

No almacenar lógica de negocio.

Actualmente:

- CartContext
- TableContext

---

# Reutilización

Antes de crear un componente nuevo preguntarse:

- ¿Existe uno parecido?
- ¿Puede ampliarse?
- ¿Puede hacerse genérico?

Duplicar código es el último recurso.

---

# Errores

Nunca ignorar errores.

Siempre:

```ts
if (error) throw error;
```

o

```ts
try {

} catch (error) {

}
```

---

# Build

Antes de cada commit ejecutar:

```bash
npm run build
```

El proyecto debe compilar sin errores.

---

# Deploy

Después del build:

```
git add .

git commit

git push
```

Verificar el despliegue en Vercel.

---

# Documentación

Toda funcionalidad importante debe actualizar:

- CHANGELOG.md
- ROADMAP.md (si aplica)
- ARCHITECTURE.md (si cambia la arquitectura)

---

# Convenciones del proyecto

Siempre utilizar el mismo nombre que en la base de datos.

Ejemplo:

```ts
status

accept_orders

category_id

featured

available
```

No inventar nombres diferentes para el mismo dato.

---

# Calidad

Antes de dar una tarea por terminada comprobar:

- Compila.
- Está tipada.
- Sigue la arquitectura.
- No duplica código.
- Funciona en local.
- Funciona en Vercel.

---

# Regla de oro

Si una solución hace el proyecto más difícil de mantener dentro de un año, no es la solución correcta.

Siempre priorizar la claridad, la reutilización y la consistencia frente a escribir menos código.