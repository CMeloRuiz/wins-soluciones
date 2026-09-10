-- ===== Esquema del contenido editable de WINS Soluciones =====
--
-- Se ejecuta UNA vez sobre la base de datos de Neon, antes del primer
-- arranque y antes de "npm run migrar". Es idempotente: volver a lanzarlo no
-- rompe nada ni borra datos.
--
-- Como ejecutarlo:
--   a) Pegarlo en el SQL Editor del panel de Neon, o
--   b) desde backend/:  npm run db:crear
--
-- Por que una tabla de secciones y no columnas por cada texto:
-- el contenido del panel son tres bloques de forma muy distinta entre si
-- (textos sueltos del hero, rutas de imagenes, y una lista de municipios con
-- sus veredas). Normalizarlo en columnas obligaria a migrar el esquema cada
-- vez que se anada un campo al panel. Con una fila por seccion y JSONB, el
-- contenido se guarda igual que estaba en el archivo JSON y el panel puede
-- crecer sin tocar la base.

CREATE TABLE IF NOT EXISTS contenido (
  id             SERIAL PRIMARY KEY,

  -- Nombre de la seccion: 'hero', 'imagenes' o 'cobertura'. Es la clave por
  -- la que el backend lee y escribe, de ahi el UNIQUE.
  clave          VARCHAR(100) UNIQUE NOT NULL,

  -- El contenido de la seccion tal cual, con su anidacion.
  datos          JSONB NOT NULL,

  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- El backend siempre busca por clave. Con tres filas Postgres haria un scan
-- igualmente, pero el indice lo crea ya el UNIQUE de arriba, asi que no hace
-- falta anadir ninguno.

COMMENT ON TABLE  contenido IS 'Secciones editables del sitio desde el panel administrativo';
COMMENT ON COLUMN contenido.clave IS 'hero | imagenes | cobertura';
COMMENT ON COLUMN contenido.datos IS 'Contenido de la seccion en JSON, misma forma que tenia en data/contenido.json';
