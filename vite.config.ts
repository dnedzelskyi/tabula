import { defineConfig } from 'vitest/config';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  root: '.',
  plugins: [viteSingleFile()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'esbuild',
    cssCodeSplit: false,
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
    },
  },
});
