import { lazy, type JSX } from "react";
import type { RouteObject } from "react-router";
import { getRouteSegmentsForBoundaryFile } from "../utils/path";
import { setRoute } from "../utils/route";

/**
 * Adds error boundaries to routes based on error component files.
 */
export function addErrorElementToRoutes(
  errorFiles: Record<string, () => Promise<unknown>>,
  routes: RouteObject
): void {
  Object.entries(errorFiles).forEach(([filePath, importer]) => {
    const segments = getRouteSegmentsForBoundaryFile(filePath);
    const ErrorBoundary = lazy(importer as () => Promise<{ default: () => JSX.Element }>);

    setRoute(segments, routes, (route) => {
      route.errorElement = <ErrorBoundary />;
      return route;
    });
  });
}
