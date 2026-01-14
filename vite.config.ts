import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        // HMR 최적화
        hmr: {
          overlay: true,
        },
        // 파일 감시 최적화
        watch: {
          // node_modules 제외
          ignored: ['**/node_modules/**', '**/dist/**', '**/.git/**'],
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      // 최적화 옵션
      optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom'],
        exclude: ['@supabase/supabase-js'],
      },
      // 빌드 최적화
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom', 'react-router-dom'],
              'supabase': ['@supabase/supabase-js'],
            },
          },
        },
      },
    };
});
