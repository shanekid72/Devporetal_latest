import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ command, mode }) => {
  // Use root path for both dev and production (simpler deployment)
  const base = '/';
  
  return {
    plugins: [react()],
    base,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 3002,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
          ws: true,
        }
      }
    },
    build: {
      outDir: "dist",
      sourcemap: false, // Never generate sourcemaps in production
      chunkSizeWarningLimit: 5000,
      minify: mode === 'production' ? 'terser' : 'esbuild',
      terserOptions: mode === 'production' ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        },
        format: {
          comments: false,
        },
      } : undefined,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules/react') || 
                id.includes('node_modules/react-dom') || 
                id.includes('node_modules/react-router-dom') ||
                id.includes('node_modules/scheduler')) {
              return 'react-vendor';
            }
            
            if (id.includes('node_modules/swagger-ui-react') || 
                id.includes('node_modules/swagger-ui-dist') ||
                id.includes('node_modules/swagger-client') ||
                id.includes('node_modules/swagger2openapi')) {
              return 'swagger-ui';
            }
            
            if (id.includes('node_modules/gsap') || 
                id.includes('node_modules/framer-motion')) {
              return 'animation';
            }
            
            if (id.includes('node_modules/@splinetool')) {
              return 'spline';
            }
            
            if (id.includes('node_modules/prism-react-renderer') || 
                id.includes('node_modules/react-syntax-highlighter') ||
                id.includes('node_modules/prismjs') ||
                id.includes('node_modules/refractor') ||
                id.includes('node_modules/highlight.js')) {
              return 'code-highlighting';
            }
            
            if (id.includes('node_modules/@headlessui') || 
                id.includes('node_modules/lucide-react') ||
                id.includes('node_modules/clsx') ||
                id.includes('node_modules/tailwind-merge') ||
                id.includes('node_modules/@tailwindcss')) {
              return 'ui-libs';
            }
            
            if (id.includes('node_modules/axios') ||
                id.includes('node_modules/jszip') ||
                id.includes('node_modules/styled-components')) {
              return 'utils';
            }
          },
        },
      },
    },
  };
});
