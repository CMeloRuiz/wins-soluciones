# Backend de WINS Soluciones

API que da servicio al panel administrativo (`/admin` en el sitio) y entrega
el contenido editable al sitio publico.

Node.js + Express + PostgreSQL (Neon). Ver [Persistencia](#persistencia).

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

---

## Estructura

```
backend/
  db/schema.sql            Definicion de la tabla. Se ejecuta una vez.
  data/contenido.json      Respaldo historico. Ya NO se usa en caliente.
  uploads/                 Imagenes subidas desde el panel.
  src/
    config/
      entorno.js           Lee y valida las variables de entorno.
      db.js                Pool de conexiones y traduccion de fallos a 503.
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

El sitio publico esta en Render como Static Site. Este backend necesita un
servicio aparte, de tipo Web Service, porque es un proceso que corre siempre.

Los dos servicios estan declarados en el [`render.yaml`](../render.yaml) de
la raiz: el sitio estatico (`wins-soluciones`) y esta API (`wins-api`).

### Antes de desplegar

Prepara la base de datos. Se hace **una sola vez y desde tu equipo**, con la
`DATABASE_URL` de Neon en tu `.env` local, porque la base es la misma que
usara Render:

```bash
cd backend
npm run db:crear
npm run migrar
```

Y ten a mano el hash de la clave del administrador (`npm run hash`).

### Al aplicar el blueprint

Render pide los valores marcados como `sync: false`. No estan en el
repositorio, y una vez guardados quedan cifrados en Render:

| Variable | Servicio | Que poner |
|---|---|---|
| `DATABASE_URL` | wins-api | La cadena *pooled* de Neon |
| `ADMIN_USUARIO` | wins-api | El usuario del panel |
| `ADMIN_CLAVE_HASH` | wins-api | El hash, nunca la clave |
| `ORIGENES_PERMITIDOS` | wins-api | La URL del sitio publicado |
| `VITE_API_URL` | wins-soluciones | La URL de `wins-api` |

`JWT_SECRETO` lo genera Render solo; no hay que inventarlo.

### El orden importa

`ORIGENES_PERMITIDOS` y `VITE_API_URL` se necesitan mutuamente: cada servicio
tiene que conocer la URL del otro, y esas URLs no existen hasta el primer
despliegue. Asi que:

1. Despliega. Las dos variables pueden quedar vacias de momento.
2. Copia la URL de cada servicio ya desplegado.
3. Rellena `ORIGENES_PERMITIDOS` en `wins-api` (**sin barra final**) y
   `VITE_API_URL` en `wins-soluciones`.
4. Vuelve a desplegar **el sitio estatico**. Vite incrusta `VITE_API_URL` en el
   bundle durante el build, no la lee al ejecutarse, asi que cambiarla sin
   reconstruir no surte efecto.

Mientras tanto el sitio se ve igual que siempre: sin `VITE_API_URL` se pinta
con el contenido que ya lleva escrito. Lo unico que no funciona todavia es el
panel.

Si el panel dice que no puede conectarse, lo primero que hay que mirar es
`ORIGENES_PERMITIDOS`: cuando el origen no coincide, la API responde 403 y
deja en su log el origen que rechazo.

### Lo que sigue siendo efimero

El contenido ya no se pierde entre despliegues: vive en Neon, fuera de Render.

Lo que **si** se sigue perdiendo son las **imagenes subidas desde el panel**.
Se guardan en `uploads/` dentro del contenedor, y el disco de un Web Service
en Render es efimero salvo que se conecte un disco persistente. Tras un
redespliegue, las rutas quedan apuntando en la base a archivos que ya no
existen.

Para resolverlo hay dos caminos, ninguno hecho todavia:

- conectar un disco persistente al Web Service, o
- subir las imagenes a un servicio de objetos (Cloudinary, S3, Supabase
  Storage) y guardar en la base la URL en vez de la ruta local.

Mientras tanto, el panel sigue funcionando y basta con volver a subir las
imagenes despues de un despliegue. Las que trae el sitio por defecto no se ven
afectadas: son parte del frontend.
