import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
  define: {
    "process.env.VITE_SUPABASE_URL": JSON.stringify(
      process.env.VITE_SUPABASE_URL,
    ),
    "process.env.VITE_SUPABASE_SERVICE_ROLE_KEY": JSON.stringify(
      process.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
    ),
  },
  build: {
    rollupOptions: {
      external: ["registry-js"],
    },
  },
});
