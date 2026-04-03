import { lazy } from "react";
import type {
  ExtendedRouteObject,
  LazyRouteReturn,
  LoadingModule,
  PageModuleExports,
} from "../types/route";
import { findLoadingImporter, getRouteSegmentsFromFilePath } from "../utils/path";
import { mergeRoutes } from "../utils/route";
import { createRoute } from "./route";

/**
 * Builds a React Router 7 route-level lazy function: loads the module once and returns
 * Component + loader (wrapped with middleware) + action.
 */
function createRouteLazy(importer: () => Promise<unknown>) {
  return async (): Promise<LazyRouteReturn> => {
    const module = (await importer()) as PageModuleExports;
    return {
      Component: module.default,
      loader: module.loader,
      action: module.action,
    };
  };
}

/**
 * Converts file-system based pages into React Router compatible routes.
 * Uses React Router 7's route-level lazy so each page/layout is loaded only on navigation.
 *
 * @param files - Object mapping file paths to their dynamic import functions
 * @param loadingFiles - Object mapping loading component paths to their import functions
 * @returns A complete route configuration object
 */
export function convertPagesToRoute(
  files: Record<string, () => Promise<unknown>>,
  loadingFiles: Record<string, () => Promise<unknown>> = {}
): ExtendedRouteObject {
  const routes: ExtendedRouteObject = { path: "/" };

  Object.entries(files).forEach(([filePath, importer]) => {
    const segments = getRouteSegmentsFromFilePath(filePath);
    const loadingImporter = findLoadingImporter(filePath, loadingFiles);
    const loadingComponent = loadingImporter ? lazy(loadingImporter as LoadingModule) : undefined;

    const route = createRoute({
      segments,
      lazy: createRouteLazy(importer),
      LoadingComponent: loadingComponent,
    });

    mergeRoutes(routes, route);
  });

  return routes;
}
