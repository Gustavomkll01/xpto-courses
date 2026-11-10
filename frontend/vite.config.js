import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In dev, /api is proxied to the backend (override with VITE_PROXY_TARGET)
export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5173, proxy: { '/api': process.env.VITE_PROXY_TARGET || 'http://localhost:3001' } },
});
