import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Si votre index.html et vos fichiers sources sont dans bmb-tech-api :
  root: './bmb-tech-api', // ou './' selon où se trouve votre index.html principal
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './bmb-tech-api/index.html', // Ajustez selon votre chemin exact
      }
    }
  }
});