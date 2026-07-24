import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // GitHub Pages serves this as a project site at /keyside/, not the domain root.
  base: mode === 'production' ? '/keyside/' : '/',
}));
