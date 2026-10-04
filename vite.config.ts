import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Library build: ships ESM with Tailwind class names left in place. Consumers
// import `kaleiopi-ui/theme.css` and let their own Tailwind scan this package,
// exactly like the Kaleiopi frontend's own components work today.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  publicDir: false,
  build: {
    lib: { entry: 'src/index.ts', formats: ['es'], fileName: 'index' },
    rollupOptions: { external: ['react', 'react-dom', 'react/jsx-runtime'] },
    assetsInlineLimit: 100_000,
  },
});
