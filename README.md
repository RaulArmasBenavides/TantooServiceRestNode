# TantooServiceRestNode

API REST en Node.js, Express 5 y MongoDB (Mongoose) que sirve de backend al marketplace **Angular Marketplace** (`../AngularMarketPlace2`). Gestiona usuarios y autenticación con JWT, categorías, productos, carrito, órdenes y endpoints de pagos (hoy stubs).

## Requisitos

- Node.js 18 o superior (Express 5 lo requiere; el README anterior decía 14, que ya no aplica)
- MongoDB local o en la nube (MongoDB Atlas, por ejemplo)

## Instalación y configuración

1. Instala dependencias:

   ```bash
   npm install
   ```

2. Crea tu archivo de entorno a partir de la plantilla:

   ```bash
   cp .env.example .env     # en Windows PowerShell: Copy-Item .env.example .env
   ```

3. Completa `.env`:

   | Variable | Obligatoria | Uso |
   |----------|-------------|-----|
   | `PORT` | No (3700) | Puerto HTTP del servicio |
   | `DB_CNN2` | Sí | Cadena de conexión de MongoDB (`src/database/config.ts`) |
   | `JWT_SECRET` | Sí | Firma y verifica los JWT; sin él el servicio no arranca |

   Las variables `DB_CNN`, `GOOGLE_ID` y `GOOGLE_SECRET` aparecen en el `.env` de desarrollo pero el código actual no las lee.

`.env` está en `.gitignore`. **No subas secretos al repositorio** y no los pongas en el código: todos se leen de `process.env`.

## Scripts

| Comando | Qué hace |
|---------|----------|
| `npm run build` | Compila TypeScript de `src/` a `dist/` (`tsc`) |
| `npm run typecheck` | Verifica tipos sin generar archivos |
| `npm start` | Ejecuta `nodemon dist/index.js` (**requiere haber compilado antes**; nodemon no recompila TS) |
| `npm test` | Sin pruebas todavía: solo imprime un error |

Flujo de desarrollo típico:

```bash
npm run build
npm start
```

Tras cambios en `src/`, vuelve a ejecutar `npm run build` (nodemon solo reinicia al cambiar `dist/`).

## Docker

```bash
docker build -t tantoo-backend .
docker run --rm -p 3700:3700 -e DB_CNN2="<cadena mongo>" -e JWT_SECRET="<secreto>" tantoo-backend
```

La imagen compila en una etapa y ejecuta `node dist/index.js` en otra, sin dependencias de desarrollo ni `.env` (las variables se pasan al contenedor). El stack completo con MongoDB está en el `docker-compose.yml` de la carpeta padre.

## Endpoints

Todas las rutas cuelgan de `/api`:

- `/api/usuarios`: registro, login y perfil
- `/api/project`
- `/api/categorias`
- `/api/productos`: listado público y CRUD de admin
- `/api/carrito`
- `/api/ordenes`
- `/api/pagos`: `POST /confirmar` (stub) y webhooks de Niubiz y Culqi (stubs sin verificación de firma)

Autenticación: las rutas protegidas esperan el JWT en la cabecera `x-token`. El middleware `validarJWT` valida el token y `varlidarADMIN_ROLE` exige rol `ADMIN_ROLE`. El nombre `varlidarADMIN_ROLE` tiene una errata que se mantiene por compatibilidad.

## Estructura

- `src/index.ts`: arranque, conexión a la base de datos y `listen`
- `src/app.ts`: middlewares globales (JSON, CORS con `origin: "*"`) y montaje de rutas
- `src/routes/` → `src/controllers/` → `src/models/`: un trío por recurso
- `src/middlewares/`: validación JWT, validación de campos y caché (`express-expeditious`)
- `src/helpers/jwt.ts`: generación de tokens (expiran en 12 h)

## Estado

- **Pruebas:** no hay pruebas automatizadas.
- **Pagos:** `confirmarPago` marca cualquier orden propia como pagada (stub). Los webhooks no verifican firma. No es apto para producción hasta implementar la integración real.
- **CORS:** abierto a cualquier origen. Restringir antes de desplegar.

## Licencia

ISC
