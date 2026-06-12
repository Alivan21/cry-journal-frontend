import path from "path";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "react-vendor",
              test: /node_modules[\\/]react(-dom|-router)?/,
              priority: 30,
            },
            {
              name: "data-vendor",
              test: /node_modules[\\/](@tanstack|axios|zod|zustand)/,
              priority: 25,
            },
            {
              name: "ui-vendor",
              test: /node_modules[\\/](radix-ui|@base-ui|react-day-picker|sonner)/,
              priority: 20,
            },
            {
              name: "icons-vendor",
              test: /node_modules[\\/]lucide-react/,
              priority: 15,
            },
            {
              name: "date-vendor",
              test: /node_modules[\\/]date-fns/,
              priority: 15,
            },
            {
              name: "vendor",
              test: /node_modules/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
});
