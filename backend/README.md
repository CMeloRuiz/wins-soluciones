# Backend de WINS Soluciones

API que da servicio al panel administrativo (`/admin` en el sitio) y entrega
el contenido editable al sitio publico.

Node.js + Express. El contenido se guarda en PostgreSQL (Neon) y las imagenes
en Cloudinary. Ver [Persistencia](#persistencia).

---

## Levantarlo en local

```bash
cd backend
npm install
cp .env.example .env      # y completa las variables, DATABASE_URL incluida
npm run db:crear          # crea la tabla (una sola vez por base de datos)
npm run migrar            # pasa data/contenido.json a la base (una sola vez)
npm run dev               # con recarga automatica
```

Queda escuchando en `http://localhost:4000`.
Para comprobarlo: `curl http://localhost:4000/api/salud`

En produccion se arranca con `npm start`.

Los dos pasos de base de datos solo se hacen la primera vez. En arranques
posteriores basta con `npm run dev`.

### Variables de entorno

Todas viven en `.env`, que **no** se sube al repositorio. La plantilla es
`.env.example`.

| Variable | Obligatoria | Para que sirve |
|---|---|---|
| `PORT` | no | Puerto. Por defecto `4000`. |
| `ORIGENES_PERMITIDOS` | no | Origenes que pueden llamar a la API, separados por coma. Por defecto `http://localhost:5173`. En produccion pon aqui la URL del sitio. |
| `JWT_SECRETO` | **si** | Cadena larga y aleatoria con la que se firman las sesiones. |
| `JWT_DURACION` | no | Cuanto dura la sesion. Por defecto `8h`. |
| `ADMIN_USUARIO` | **si** | Usuario del administrador. |
| `ADMIN_CLAVE_HASH` | **si** (o `ADMIN_CLAVE`) | Hash bcrypt de la clave. |
| `ADMIN_CLAVE` | alternativa | Clave en texto plano. El servidor la hashea al arrancar. Comodo para empezar, pero deja la clave legible en el archivo. |
| `MAX_IMAGEN_MB` | no | Tamano maximo por imagen. Por defecto `4`. |
| `DATABASE_URL` | **si** | Cadena de conexion de PostgreSQL en Neon. Ver abajo. |
| `CLOUDINARY_CLOUD_NAME` | para imagenes | Nombre de la cuenta de Cloudinary. |
| `CLOUDINARY_API_KEY` | para imagenes | Clave publica de la API. |
| `CLOUDINARY_API_SECRET` | para imagenes | Secreto de la API. |

Generar el secreto de sesion:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Generar el hash de la clave (lo recomendado):

```bash
npm run hash -- tuClaveSegura
```

Copia la linea que imprime y pegala en `.env`.

### DATABASE_URL

La da el panel de [Neon](https://neon.tech), en **Connection Details**.

Usa la opcion **Pooled connection**, no la directa. Se distingue porque el
host lleva `-pooler`:

```
postgresql://USUARIO:CLAVE@ep-algo-123456-pooler.REGION.aws.neon.tech/DB?sslmode=require
```

Sin pooling, cada reinicio del servicio deja conexiones abiertas y se acaba
agotando el limite de conexiones del proyecto. Con reinicios frecuentes
(Render redespliega en cada push) eso pasa antes de lo que parece.

Si la variable falta o la base no responde, el servidor **arranca igual** y
avisa por consola; las rutas de contenido responden `503` con el motivo, y
`/api/salud` sigue funcionando. Se hizo asi a proposito: un backend caido sin
explicacion es mas dificil de diagnosticar que uno que responde diciendo que
le falta la base de datos.

### Credenciales de Cloudinary

Las tres salen del Dashboard de [Cloudinary](https://cloudinary.com), en
**API Keys**. El plan gratuito no pide tarjeta y da 25 GB de almacenamiento y
25 GB de trafico al mes, muy por encima de lo que necesitan tres imagenes.

Sin ellas el servidor tambien arranca: el sitio publico se ve igual, porque
usa las imagenes que trae empaquetadas, y solo la pestana de imagenes del
panel responde `503` explicando que falta configurarlo.

---

## Estructura

```
backend/
  db/schema.sql            Definicion de la tabla. Se ejecuta una vez.
  data/contenido.json      Respaldo historico. Ya NO se usa en caliente.
  src/
    config/
      entorno.js           Lee y valida las variables de entorno.
      db.js                Pool de conexiones y traduccion de fallos a 503.
      imagenes.js          Subida y borrado en Cloudinary.
    models/
      almacen.js           Unico punto de acceso a la base de datos.
      contenidoInicial.js  Contenido de fabrica, para sembrar y restaurar.
    middleware/
      autenticacion.js     Verifica el token en las rutas privadas.
      errores.js           404 y manejador final de errores.
    controllers/           Logica y validacion de cada recurso.
    routes/                Definicion de las rutas.
    scripts/
      generarHash.js       Utilidad para la clave del administrador.
      crearEsquema.js      npm run db:crear
      migrarContenido.js   npm run migrar
    server.js              Arranque.
```

---

## Rutas

Las publicas las consume el sitio para pintarse. Las privadas piden la
cabecera `Authorization: Bearer <token>`.

### Autenticacion

| Metodo | Ruta | Acceso | Que hace |
|---|---|---|---|
| POST | `/api/auth/login` | publica | Recibe `{ usuario, clave }` y devuelve el token. |
| GET | `/api/auth/verificar` | privada | Dice si el token sigue siendo valido. |

### Contenido

| Metodo | Ruta | Acceso | Que hace |
|---|---|---|---|
| GET | `/api/contenido` | publica | Todo el contenido de una vez. |
| GET | `/api/contenido/hero` | publica | Solo los textos del hero. |
| GET | `/api/contenido/imagenes` | publica | Rutas de las imagenes subidas. |
| PUT | `/api/contenido/hero` | privada | Guarda los textos del hero. |
| POST | `/api/contenido/imagenes/:ranura` | privada | Sube una imagen (campo `imagen`, multipart). |
| DELETE | `/api/contenido/imagenes/:ranura` | privada | Vuelve a la imagen original del sitio. |
| POST | `/api/contenido/restaurar` | privada | Devuelve todo el contenido a como venia de fabrica. |

Ranuras de imagen validas: `heroFondo`, `nosotrosEquipo`, `contactoFondo`.
Se aceptan JPG, PNG y WEBP.

### Cobertura

| Metodo | Ruta | Acceso | Que hace |
|---|---|---|---|
| GET | `/api/cobertura` | publica | Municipios y veredas. |
| PUT | `/api/cobertura` | privada | Reemplaza la lista completa. |

**Importante:** aqui solo se editan nombres y listados. La geometria de los
mapas (los `path` SVG de `frontend/src/data/coberturaDeptData.js`) no se toca
desde el panel: son coordenadas reales del IGAC y el DANE, y modificarlas
deformaria el dibujo.

---

## Persistencia

El contenido editable vive en **PostgreSQL (Neon)**, en la tabla `contenido`:
una fila por seccion, con el JSON de esa seccion en una columna `JSONB`.

| clave | que guarda |
|---|---|
| `hero` | Textos y estadisticas del inicio |
| `imagenes` | Rutas de las imagenes subidas por ranura |
| `cobertura` | Municipios con sus veredas |

Se eligio una tabla de secciones con `JSONB` en lugar de columnas por cada
campo porque los tres bloques tienen formas muy distintas entre si, y porque
el panel va a seguir creciendo: anadir un texto nuevo al hero no obliga a
migrar el esquema. El contenido se guarda con la misma anidacion que tenia en
el archivo JSON.

La definicion esta en [`db/schema.sql`](db/schema.sql). Es idempotente
(`CREATE TABLE IF NOT EXISTS`), asi que volver a ejecutarlo no borra nada.

### Primera vez: crear y migrar

```bash
npm run db:crear    # aplica db/schema.sql
npm run migrar      # copia data/contenido.json a la tabla
```

`npm run migrar` no pisa nada por accidente: si la tabla ya tiene esas
secciones, lo dice y pide confirmacion antes de sobrescribir. Con
`npm run migrar -- --forzar` no pregunta, para poder lanzarlo sin nadie
delante.

En una instalacion nueva la migracion no es imprescindible: si la tabla esta
vacia, el backend siembra las tres secciones con el contenido de fabrica al
arrancar (`src/models/contenidoInicial.js`).

**Lanza la migracion con la API parada**, o reiniciala despues. El servidor
guarda el contenido en memoria y no se entera de los cambios hechos por fuera.

### Sobre data/contenido.json

Ya **no es la fuente de verdad**. Queda en el repositorio como respaldo
historico de lo que habia antes de migrar, y como origen del script de
migracion. El backend no lo lee ni lo escribe en ningun momento; se puede
borrar sin que nada deje de funcionar, pero se conserva por si hace falta
recuperar contenido antiguo.

### Cache en memoria

El contenido se cachea en el proceso y el cache se invalida al guardar, asi
que un cambio del panel se ve al instante en el sitio. Esto es exacto con una
sola instancia del servidor, que es el caso en Render. Si algun dia corren
varias a la vez, cada una tendria su copia y un cambio tardaria en verse en
las demas: entonces habria que quitar el cache de `src/models/almacen.js` o
darle un tiempo de vida.

## Relacion con el sitio publico

El sitio pide `GET /api/contenido` al cargar y, si responde, usa esos textos
e imagenes. Si la API esta apagada, tarda o no esta desplegada, cada seccion
se pinta con el contenido que ya lleva escrito en el codigo.

Dicho de otro modo: **el sitio publico no depende de este servidor**. Solo lo
aprovecha si esta disponible. Si nunca despliegas el backend, el sitio se
comporta exactamente igual que antes de que existiera.

En el frontend esto se configura con `VITE_API_URL` (ver `frontend/.env.example`).

---

## Desplegarlo

El sitio publico esta en Render como Static Site, desplegado con el
[`render.yaml`](../render.yaml) de la raiz. Este backend necesita un servicio
aparte, de tipo Web Service, porque es un proceso que corre siempre.

**No esta declarado en el blueprint** a proposito: se crea a mano, para poder
desplegarlo y reiniciarlo por separado del sitio.

### Antes de desplegar

Prepara la base de datos. Se hace **una sola vez y desde tu equipo**, con la
`DATABASE_URL` de Neon en tu `.env` local, porque la base es la misma que
usara Render:

```bash
cd backend
npm run db:crear
npm run migrar
```

Ten a mano tambien el hash de la clave del administrador (`npm run hash`) y
las tres credenciales de Cloudinary.

### Crear el Web Service

En Render, **New -> Web Service**, apuntando a este repositorio:

| Campo | Valor |
|---|---|
| Root directory | `backend` |
| Build command | `npm install` |
| Start command | `npm start` |
| Health check path | `/api/salud` |

Variables de entorno:

| Variable | Que poner |
|---|---|
| `DATABASE_URL` | La cadena *pooled* de Neon |
| `ADMIN_USUARIO` | El usuario del panel |
| `ADMIN_CLAVE_HASH` | El hash, nunca la clave |
| `JWT_SECRETO` | Una cadena larga y aleatoria |
| `ORIGENES_PERMITIDOS` | La URL del sitio publicado, sin barra final |
| `CLOUDINARY_CLOUD_NAME` | Del Dashboard de Cloudinary |
| `CLOUDINARY_API_KEY` | Del Dashboard de Cloudinary |
| `CLOUDINARY_API_SECRET` | Del Dashboard de Cloudinary |

`PORT` la asigna Render sola. `JWT_DURACION` y `MAX_IMAGEN_MB` tienen valores
por defecto en el codigo.

### El orden importa

`ORIGENES_PERMITIDOS` y `VITE_API_URL` se necesitan mutuamente: cada servicio
tiene que conocer la URL del otro, y esas URLs no existen hasta el primer
despliegue. Asi que:

1. Despliega el backend. `ORIGENES_PERMITIDOS` puede quedar vacia de momento.
2. Copia la URL que Render le asigna.
3. Ponla en `VITE_API_URL` del sitio estatico, y la URL del sitio en
   `ORIGENES_PERMITIDOS` del backend (**sin barra final**).
4. Vuelve a desplegar **el sitio estatico**. Vite incrusta `VITE_API_URL` en el
   bundle durante el build, no la lee al ejecutarse, asi que cambiarla sin
   reconstruir no surte efecto.

Si el panel dice que no puede conectarse, lo primero que hay que mirar es
`ORIGENES_PERMITIDOS`: cuando el origen no coincide, la API responde 403 y
deja en su log el origen que rechazo.

### El arranque en frio, y por que importa

En el plan gratuito de Render un Web Service **se duerme tras 15 minutos sin
trafico** y tarda cerca de un minuto en volver.

Eso no afecta a la velocidad del sitio: el sitio estatico se sirve desde la
CDN y se pinta al instante, y la llamada a la API va por detras, con un limite
de 4 segundos. Si no llega a tiempo, cada seccion se queda con el contenido
que lleva escrito. El visitante nunca espera.

Lo que si rompe es el **proposito del panel**: si la API esta dormida, la
peticion la despierta pero termina mucho despues de que la pagina se haya
rendido, asi que lo editado no se ve. Con el servicio dormido casi todo el
tiempo, el sitio publico mostraria practicamente siempre el contenido del
codigo, no el de la base.

La forma habitual de evitarlo, y gratis, es **mantenerlo despierto**: un
servicio externo de monitorizacion que pida `/api/salud` cada 10 minutos.
Sirven [cron-job.org](https://cron-job.org) o [UptimeRobot](https://uptimerobot.com),
los dos con plan gratuito. Render da 750 horas de instancia al mes y un unico
servicio despierto consume unas 730, asi que entra justo.

Sin eso, el panel sigue funcionando para quien lo usa (al entrar despierta la
API y espera lo que haga falta), pero sus cambios rara vez llegarian al
visitante.

### Nada queda en el disco del servicio

Ni el contenido ni las imagenes viven en el contenedor de Render, asi que un
redespliegue no se lleva nada por delante:

| Que | Donde vive |
|---|---|
| Textos, municipios y veredas | PostgreSQL en Neon |
| Imagenes subidas desde el panel | Cloudinary |
| Imagenes por defecto del sitio | El propio bundle del frontend |

Antes las imagenes se guardaban en `uploads/` dentro del contenedor y se
perdian en cada despliegue, dejando la base apuntando a archivos que ya no
existian. Esa carpeta ya no se usa.

