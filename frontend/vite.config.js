import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Rutas absolutas desde la raiz del dominio. Es el valor por defecto de Vite,
  // pero se deja explicito: si alguien lo cambia a una subruta fija, los assets
  // y las rutas de React Router dejarian de resolverse en el dominio de Render.
  base: '/',

  build: {
    outDir: 'dist',
    // Los sourcemaps no se publican: pesan y exponen el codigo fuente.
    sourcemap: false,
  },
})
