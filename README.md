# Forja Rocktalica · API

API REST de **Forja Rocktalica**, la tienda de instrumentos y equipos para rock y metal de la Entrega 1, ahora con base de datos real, usuarios y roles.

- 🌐 Sitio (frontend en Vercel): https://forja-rocktalica.vercel.app
- 🔌 API desplegada (Render): https://forja-api-uf85.onrender.com
- 📦 Repositorio del frontend: https://github.com/Santi-a-ux/Forja-Rocktalica-frontend

**Stack:** Node.js · Express · TypeScript · Prisma · PostgreSQL · JWT · bcrypt · zod · vitest

## Arquitectura (cuatro capas)

```
src/
├── domain/          entidades, errores y contratos de repositorios (sin dependencias externas)
├── application/     casos de uso (AuthService, InstrumentoService, ConsultaService...) y puertos
├── infrastructure/  Prisma (único lugar donde se usa), bcrypt, JWT y variables de entorno
├── interface/http/  rutas, controladores, middlewares (auth, rol, validación, errores) y esquemas zod
├── container.ts     raíz de composición: conecta implementaciones con servicios
└── app.ts / server.ts
```

## Modelo de datos

| Tabla | Para qué sirve |
|-------|----------------|
| `User` | nombre, email único, `password` (hash bcrypt) y `role` (`admin` \| `user`) |
| `Marca` | Fender, Gibson, Ibanez y Marshall (antes `luthiers` en la Entrega 1) |
| `Instrumento` | catálogo; llave foránea a `Marca`; categoría como `enum` |
| `Consulta` | interacción (lo que hacía el formulario): llaves foráneas a `User` e `Instrumento` |

## Correrlo en local

Requisitos: Node 20+ y un PostgreSQL local (o una base gratuita en Render/Neon).

```bash
npm install
cp .env.example .env          # y completa DATABASE_URL y JWT_SECRET
npx prisma migrate deploy     # aplica las migraciones que ya están en prisma/migrations
npm run seed                  # carga marcas, instrumentos y usuarios de prueba
npm run dev                   # http://localhost:4000
npm test                      # pruebas de los middlewares de autenticación y rol
```

> **Nota:** `prisma migrate dev` necesita permisos de superusuario para crear su base de prueba y falla en la base gratuita de Render. Por eso la migración inicial se generó con `prisma migrate diff` y se aplica con `prisma migrate deploy`, el mismo comando que usa el Build Command de Render. Si cambias el esquema en una base local, puedes usar `migrate dev` para generar migraciones nuevas.

### Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | cadena de conexión a PostgreSQL |
| `JWT_SECRET` | secreto para firmar los tokens (largo y aleatorio) |
| `JWT_EXPIRES_IN` | vigencia del token (por ejemplo `1h`) |
| `PORT` | puerto del servidor |
| `CORS_ORIGIN` | URL(s) del frontend permitidas, separadas por coma (la de Vercel en producción) |

## Credenciales de prueba (creadas por el seed, solo para el ambiente de la entrega)

| Rol | Correo | Contraseña |
|-----|--------|------------|
| admin | `admin@forja.com` | `Admin12345` |
| user | `user@forja.com` | `User12345` |

## Endpoints

| Método | Ruta | Acceso |
|--------|------|--------|
| POST | `/api/auth/register` | Público (409 si el correo ya existe) |
| POST | `/api/auth/login` | Público (401 genérico si las credenciales son inválidas) |
| GET | `/api/auth/me` | Autenticado |
| GET | `/api/instrumentos?page=&limit=&categoria=&q=&minPrecio=&maxPrecio=` | Público · `{ pagination, data }` |
| GET | `/api/instrumentos/:id` | Público |
| POST · PUT · DELETE | `/api/instrumentos` · `/:id` | Solo admin |
| GET | `/api/marcas` | Público |
| POST | `/api/consultas` | Autenticado (el autor sale del token) |
| GET | `/api/consultas/mias` | Autenticado (solo las suyas) |
| GET | `/api/consultas` | Solo admin (todas) |
| PATCH | `/api/consultas/:id/estado` | Solo admin |
| DELETE | `/api/consultas/:id` | Dueño de la consulta o admin |

Errores: `400` validación (con detalle por campo), `401` sin token / token inválido o expirado / credenciales inválidas, `403` token válido sin permiso, `404` no existe, `409` duplicado o registros relacionados. Nunca se devuelve el stack trace.

## Despliegue en Render

1. Crea un **PostgreSQL** en Render y copia su *Internal Database URL* (para el servicio) y su *External Database URL* (para correr el seed desde tu computador). El servicio y la base deben estar en la misma región.
2. Crea un **Web Service** conectado a este repositorio:
   - Build command: `npm install && npm run build && npx prisma migrate deploy`
   - Start command: `npm start`
3. Variables de entorno: `DATABASE_URL` (la Internal URL), `JWT_SECRET`, `JWT_EXPIRES_IN` y `CORS_ORIGIN` (`https://forja-rocktalica.vercel.app`, sin `/` final y sin espacios).
4. Carga los datos una vez: ejecuta `npm run seed` en tu computador con la `DATABASE_URL` en modo **External** en tu `.env` local (nunca subas ese archivo al repositorio).

## Decisiones técnicas

### Flujo completo de un login, desde el formulario hasta una ruta protegida

1. **Recepción:** El endpoint `POST /api/auth/login` recibe las credenciales ingresadas en `auth.controller.ts`.
2. **Búsqueda:** `AuthService.ingresar()` consulta la existencia del usuario mediante `UserPrismaRepository`.
3. **Verificación de Contraseña:** Se valida la clave enviada contra el hash en la base de datos usando `BcryptHasher.compare()`. Si no coincide, se lanza un `AppError(401, "CREDENCIALES_INVALIDAS")`.
4. **Firma del JWT:** Si la verificación es exitosa, `JwtTokenService.firmar()` genera un JWT firmado con `JWT_SECRET`, incluyendo únicamente `id` y `role` en el payload.
5. **Autenticación en Rutas:** Al realizar una solicitud protegida (ej. `DELETE /api/instrumentos/:id`), el middleware `autenticacion.ts` lee la cabecera `Authorization: Bearer <token>`, valida el token con `jwt.verify()` y adjunta los datos al objeto `req.user`.
6. **Autorización por Rol:** El middleware `roles.ts` (`soloAdmin`) evalúa `req.user.role`. Si el rol es `'admin'`, permite el paso al controlador; de lo contrario, responde inmediatamente con código HTTP 403.

### ¿Dónde guardas el token en el frontend y qué riesgo tiene esa decisión?

El token lo guarda el frontend en `localStorage` con la clave `forja-token`; el análisis completo del riesgo (XSS) y la alternativa con cookies `httpOnly` está en el [README del frontend](https://github.com/Santi-a-ux/Forja-Rocktalica-frontend#readme). Desde la API: el token se firma con `JWT_SECRET`, lleva solo `id` y `role`, vence según `JWT_EXPIRES_IN` y el servidor no lo guarda; cada petición se valida con `jwt.verify()`.

### ¿En qué caso responde 401 y en cuál 403? Ejemplo real de este proyecto

- **401 Unauthorized:** Se retorna cuando la petición carece de token de autenticación, el token ha expirado o la firma no es válida.
- **403 Forbidden:** Se retorna cuando la petición incluye un token válido de un usuario autenticado, pero este no posee el rol necesario para acceder al recurso.

**Peticiones probadas en este proyecto:**
* **Caso 401:** Solicitud `DELETE https://forja-api-uf85.onrender.com/api/instrumentos/1` enviada sin el encabezado `Authorization`.
  * *Respuesta:* `HTTP 401 Unauthorized` → `{"error": {"codigo": "NO_AUTENTICADO", "mensaje": "Debes iniciar sesión para continuar"}}`
* **Caso 403:** Solicitud `DELETE https://forja-api-uf85.onrender.com/api/instrumentos/1` enviada con el token del usuario `user@forja.com` (rol `user`).
  * *Respuesta:* `HTTP 403 Forbidden` → `{"error": {"codigo": "PROHIBIDO", "mensaje": "No tienes permiso para realizar esta acción"}}`

### Si usaste IA, ¿para qué la usaste y qué tuviste que corregir?

Usé Claude para generar un poco la base de la API, el esquema de Prisma, la seed, la validación con zod y las pruebas de los middlewares. .

**Lo que tuve que corregir o resolver:**
1. **Migración:** `prisma migrate dev` falló contra la base gratuita de Render (`permission denied to terminate process`), porque necesita permisos de superusuario para su base de prueba. Generé la migración inicial con `prisma migrate diff`, la guardé en `prisma/migrations/` y la apliqué con `prisma migrate deploy`, que es el mismo comando del Build Command de Render. Luego corrí el seed desde mi computador.
2. **CORS:** al conectar el frontend desplegado, el navegador bloqueó las peticiones. La causa era que abrí el sitio por una URL distinta a la configurada en `CORS_ORIGIN`; la API solo acepta el origen exacto, así que dejé `https://forja-rocktalica.vercel.app`.

## Captura de la pestaña Network

Petición `GET /api/consultas/mias` al sitio desplegado, con la sesión iniciada como `user@forja.com`. Se ve el header `Authorization: Bearer ...` (con el token parcialmente tapado) y la respuesta `200`.

![Petición protegida con el header Authorization](docs/network.png)
