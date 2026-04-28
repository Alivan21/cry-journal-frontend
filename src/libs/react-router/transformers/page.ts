import type { ExtendedRouteObject, LazyRouteReturn, PageModuleExports } from "../types/route";
import { getRouteSegmentsFromFilePath } from "../utils/path";
import { mergeRoutes } from "../utils/route";
import { createRoute } from "./route";

/**
 * Builds a React Router 7 route-level lazy function.
 *
 * Returns `Component`, `loader`, `action`, and — if the module exports one —
 * `ErrorBoundary`.  All four are valid return values from `lazy()` in React
 * Router 7 and are merged onto the static route object on navigation.
 */
function createRouteLazy(importer: () => Promise<unknown>) {
  return async (): Promise<LazyRouteReturn> => {
    const module = (await importer()) as PageModuleExports;
    return {
      Component: module.default,
      loader: module.loader,
      action: module.action,
      ...(module.ErrorBoundary ? { ErrorBoundary: module.ErrorBoundary } : {}),
    };
  };
}

/**
 * Converts file-system based pages into React Router compatible routes.
 * Uses React Router 7's route-level `lazy` so each page/layout chunk is only
 * fetched when the user navigates to that route.
 *
 * @param files - Object mapping file paths to their dynamic import functions
 * @returns A complete route configuration object
 */
export function convertPagesToRoute(
  files: Record<string, () => Promise<unknown>>
): ExtendedRouteObject {
  const routes: ExtendedRouteObject = { path: "/" };

  Object.entries(files).forEach(([filePath, importer]) => {
    const segments = getRouteSegmentsFromFilePath(filePath);

    const route = createRoute({
      segments,
      lazy: createRouteLazy(importer),
    });

    mergeRoutes(routes, route);
  });

  return routes;
}
