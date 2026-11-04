# Tienda de Calzado — Frontend

React 19 + Vite 8 + React Router 7 (JavaScript/JSX).

## Scripts

| Comando           | Descripción                                   |
| ----------------- | --------------------------------------------- |
| `npm install`     | Instala dependencias                          |
| `npm run dev`     | Servidor de desarrollo en http://localhost:5173 |
| `npm run build`   | Build de producción en `dist/`                |
| `npm run preview` | Sirve el build de producción localmente       |
| `npm run lint`    | Analiza el código con ESLint                  |

Copia `.env.example` a `.env` y ajusta `VITE_API_URL` cuando exista el backend.

## Editar el contenido del sitio

Todos los textos, imágenes, productos y datos de contacto están en `src/content/`.
No hace falta tocar componentes:

| Archivo                    | Qué controla                                              |
| -------------------------- | --------------------------------------------------------- |
| `src/content/sitio.js`     | Nombre, lema, menú, **WhatsApp**, contacto, redes, footer |
| `src/content/inicio.js`    | Slides del inicio (textos, imágenes, autoplay)            |
| `src/content/nosotros.js`  | Página Nosotros: cifras, misión, visión, valores, historia |
| `src/content/productos.js` | Catálogo de productos, precios, tallas y categorías       |
| `src/content/pedidos.js`   | Página Pedidos: mínimo mayorista, pasos, textos, envíos   |

Las imágenes van en `public/images/` y se referencian como `'/images/archivo.png'`.
Con `npm run dev` corriendo, los cambios se ven al guardar.

## Arquitectura

```text
src/
├── components/   # UI global reutilizable (ui/, layout/)
├── content/      # Contenido editable (textos, catálogo, contacto)
├── features/     # Módulos de negocio: landing, about, products, orders, auth
│   └── <feature>/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── index.js   # API pública de la feature
├── pages/        # Vistas asociadas a una ruta (componen features)
├── hooks/        # Hooks globales
├── services/     # Cliente HTTP compartido
├── utils/        # Funciones auxiliares
├── constants/    # Constantes globales (rutas, config)
├── routes/       # Configuración del router
├── assets/       # Estilos, imágenes, iconos
├── App.jsx
└── main.jsx
```

### Convenciones

- Importa con el alias `@/` (apunta a `src/`).
- Fuera de una feature, importa solo desde su `index.js`: `import { ProductList } from '@/features/products'`.
- Una feature no importa archivos internos de otra feature.
- Componentes = presentación. La lógica va en hooks; el acceso a datos, en services.
- Las rutas se definen en `@/constants/routes.js`; no uses strings sueltos.
- Los servicios usan datos de `src/content/` (`USE_MOCK = true`). Cámbialo a `false` para usar la API real.
- Si una feature necesita mostrar algo de otra, la **página** las compone (ej. `ProductsPage` inyecta
  `AddToOrderButton` en el catálogo mediante `renderActions`).
