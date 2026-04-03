import { lazy, type JSX } from "react";
import type { RouteObject } from "react-router";
import { getRouteSegmentsForBoundaryFile } from "../utils/path";
import { setRoute, add404ToRoute } from "../utils/route";

/**
 * Adds 404 (Not Found) pages to route children.
 */
export function add404PageToRoutesChildren(
  notFoundFiles: Record<string, () => Promise<unknown>>,
  routes: RouteObject
): void {
  Object.entries(notFoundFiles).forEach(([filePath, importer]) => {
    const segments = getRouteSegmentsForBoundaryFile(filePath);
    const NotFound = lazy(importer as () => Promise<{ default: () => JSX.Element }>);

    setRoute(segments, routes, (route) => {
      return add404ToRoute(route, <NotFound />);
    });
  });
}
