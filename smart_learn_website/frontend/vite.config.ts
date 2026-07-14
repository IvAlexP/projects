import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  // load environment variables
  // the '' parameter allows us to read any variable, not just those with the VITE_ prefix
  const env = loadEnv(mode, process.cwd(), '');
  const port = parseInt(env.FRONTEND_PORT) || 5173; // use the variable or 5173 as fallback
  const backendPort = parseInt(env.BACKEND_PORT) || 3000;
  const baseUrl = env.BASE_URL || 'http://localhost';

  return {
    plugins: [react()],
    resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
    define: {
      __BACKEND_PORT__: backendPort,
      __BACKEND_HOST__: JSON.stringify(baseUrl),
    },
    server: {
      watch: {
        usePolling: true,
      },
      host: true,
      strictPort: true,
      port: port,
    },
  }
})