import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const persoApiTarget = (
    env.PERSO_API_BASE_URL || 'https://api.perso.ai'
  ).replace(/\/+$/, '');
  const persoApiKey = env.XP_API_KEY || env.VITE_PERSO_API_KEY;

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    server: {
      proxy: {
        '/api/perso': {
          target: persoApiTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path: string) => path.replace(/^\/api\/perso/, ''),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          configure: (proxy: any) => {
            proxy.on('proxyReq', (proxyReq: any, req: any) => {
              if (persoApiKey) {
                proxyReq.setHeader('XP-API-KEY', persoApiKey);
              }
              proxyReq.removeHeader('origin');
              proxyReq.removeHeader('referer');
              console.log(`[proxy] ${req.method} ${req.url} → ${persoApiTarget}${proxyReq.path}`);
            });
            proxy.on('proxyRes', (proxyRes: any, req: any) => {
              console.log(`[proxy] ${proxyRes.statusCode} ← ${req.method} ${req.url}`);
            });
            proxy.on('error', (err: any, req: any) => {
              console.error(`[proxy] ERROR ${req.method} ${req.url}:`, err.message);
            });
          },
        },
      },
    },
    preview: {
      proxy: {
        '/api/perso': {
          target: persoApiTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path: string) => path.replace(/^\/api\/perso/, ''),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          configure: (proxy: any) => {
            proxy.on('proxyReq', (proxyReq: any) => {
              if (persoApiKey) {
                proxyReq.setHeader('XP-API-KEY', persoApiKey);
              }
              proxyReq.removeHeader('origin');
              proxyReq.removeHeader('referer');
            });
          },
        },
      },
    },
  };
});
