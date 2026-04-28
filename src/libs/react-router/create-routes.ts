import type { RouteObject } from "react-router";
import { applyAppMiddleware } from "../../middleware";
import { addErrorElementToRoutes } from "./handlers/error";
import { add404PageToRoutesChildren } from "./handlers/not-found";
import { convertPagesToRoute } from "./transformers/page";

/**
 * Creates a complete route configuration from file-based pages.
 *
 * Loading feedback during client-side navigation is handled by `useNavigation()`
 * in layout components — not by per-route `HydrateFallback`.  See the
 * `AppContainer` component for the global pending-state indicator.
 *
 * @param pageFiles - Object mapping page/layout file paths to their dynamic import functions
 * @param errorFiles - Object mapping error handler file paths to their dynamic import functions
 * @param notFoundFiles - Object mapping 404 page file paths to their dynamic import functions
 * @returns A complete route configuration object for React Router
 */
export function createRoutesFromFiles(
  pageFiles: Record<string, () => Promise<unknown>>,
  errorFiles: Record<string, () => Promise<unknown>> = {},
  notFoundFiles: Record<string, () => Promise<unknown>> = {}
): RouteObject {
  const routes = convertPagesToRoute(pageFiles) as RouteObject;
  addErrorElementToRoutes(errorFiles, routes);
  add404PageToRoutesChildren(notFoundFiles, routes);

  return applyAppMiddleware(routes);
}
