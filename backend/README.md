# Backend de WINS Soluciones

API que da servicio al panel administrativo (`/admin` en el sitio) y entrega
el contenido editable al sitio publico.

Node.js + Express. Sin base de datos por ahora: la persistencia es un archivo
JSON. Ver [Persistencia](#persistencia) mas abajo.

---

## Levantarlo en local

```bash
cd backend
npm install
cp .env.example .env      # y completa las variables
npm run dev               # con recarga automatica
```

Queda escuchando en `http://localhost:4000`.
Para comprobarlo: `curl http://localhost:4000/api/salud`

En produccion se arranca con `npm start`.

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

Generar el secreto de sesion:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Generar el hash de la clave (lo recomendado):

```bash
npm run hash -- tuClaveSegura
```

Copia la linea que imprime y pegala en `.env`.

---

## Estructura

```
backend/
  data/contenido.json      Contenido editado. Se crea solo al primer arranque.
  uploads/                 Imagenes subidas desde el panel.
  src/
    config/entorno.js      Lee y valida las variables de entorno.
    models/
      almacen.js           Unico punto de acceso al disco.
      contenidoInicial.js  Contenido de fabrica, para sembrar y restaurar.
    middleware/
      autenticacion.js     Verifica el token en las rutas privadas.
      errores.js           404 y manejador final de errores.
    controllers/           Logica y validacion de cada recurso.
    routes/                Definicion de las rutas.
    scripts/generarHash.js Utilidad para la clave del administrador.
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

**Version inicial.** Todo se guarda en `data/contenido.json`. Es suficiente
para un solo administrador y un volumen de contenido pequeno, y evita
arrastrar una base de datos antes de necesitarla.

Lo que ya esta resuelto:

- Las escrituras son atomicas (se escribe un temporal y se renombra encima),
  asi que un corte a mitad no deja el archivo truncado.
- Las escrituras simultaneas se encolan, para que no se pisen entre si.
- Si el archivo no existe o esta corrupto, se siembra con el contenido inicial.

Cuando haga falta migrar a SQLite o Postgres, **todo el acceso al disco esta
en `src/models/almacen.js`**: basta reescribir `leer` y `guardarSeccion`
manteniendo su firma. El resto del backend no se entera.

Lo que pediria una base de datos de verdad: varios administradores, historial
de cambios, o mas de una instancia del servidor a la vez (con el archivo JSON,
dos instancias se pisarian los cambios).

---

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

Al configurarlo:

1. Root directory: `backend`
2. Build command: `npm install`
3. Start command: `npm start`
4. Variables de entorno: las de la tabla de arriba.
5. `ORIGENES_PERMITIDOS` con la URL del sitio publicado.
6. En el Static Site del frontend, agrega `VITE_API_URL` con la URL de este
   servicio y vuelve a desplegar.

Un aviso sobre el disco: en Render el sistema de archivos de un Web Service es
efimero salvo que se conecte un disco persistente. Sin el, `data/contenido.json`
y las imagenes de `uploads/` se pierden en cada despliegue. Para produccion,
conecta un disco persistente o migra a una base de datos.
