import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { ThemeProvider } from "./components/providers/theme-provider.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import { createRoutesFromFiles } from "./libs/react-router/index.ts";
import { queryClient } from "./libs/tanstack-query/query-client.ts";
import "./index.css";

/**
 * Single glob covering all Next.js App Router-style special files.
 * The router classifies each file by name — no separate glob per file kind.
 *
 * Supported names: page, layout, loading, error, not-found, 404 (compat alias)
 */
const routeFiles = import.meta.glob("./app/**/{page,layout,loading,error,not-found,404}.tsx");

const routes = createRoutesFromFiles(routeFiles);
const router = createBrowserRouter([routes]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
