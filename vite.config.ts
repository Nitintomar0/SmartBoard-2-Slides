import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";

// https://vitejs.dev/config/
export default defineConfig({
  base:
    process.env.NODE_ENV === "development"
      ? "/"
      : process.env.VITE_BASE_PATH || "/",
  optimizeDeps: {
    entries: ["src/main.tsx", "src/tempobook/**/*"],
    include: ['pdfkit', '@pdf-lib/standard-fonts', 'buffer', 'process', 'util', 'stream-browserify', 'browserify-zlib', 'events', 'assert', 'crypto-browserify'],
    force: true
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },
  define: {
    'process.env.NODE_DEBUG': 'false',
    'global': 'globalThis',
    'Buffer': ['buffer', 'Buffer'],
    'process.env': {},
    'process.browser': true,
    'process.version': '"v16.0.0"'
  },
  plugins: [react(), tempo()],
  resolve: {
    preserveSymlinks: true,
    alias: {
      '@': path.resolve(__dirname, './src'),
      'events': 'events',
      'process': 'process/browser',
      'stream': 'stream-browserify',
      'zlib': 'browserify-zlib',
      'util': 'util',
      'assert': 'assert',
      'buffer': 'buffer',
      'crypto': 'crypto-browserify'
    }
  },
  server: {
    host: true,
    hmr: {
      host: "localhost",
      protocol: "ws"
    },
  },
});
