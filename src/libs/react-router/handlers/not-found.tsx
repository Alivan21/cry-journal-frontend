import type { JSX } from "react";
import type { RouteObject } from "react-router";
import { getRouteSegmentsForBoundaryFile } from "../utils/path";
import { setRoute, add404ToRoute } from "../utils/route";

/**
 * Attaches a `path: "*"` catch-all child to routes using a route-level lazy
 * function so the not-found component is code-split like every other route.
 * This avoids wrapping the component in `React.lazy`, which would require a
 * separate Suspense boundary when rendered as a plain JSX element.
 */
export function add404PageToRoutesChildren(
  notFoundFiles: Record<string, () => Promise<unknown>>,
  routes: RouteObject
): void {
  Object.entries(notFoundFiles).forEach(([filePath, importer]) => {
    const segments = getRouteSegmentsForBoundaryFile(filePath);
    const notFoundLazy = async () => {
      const { default: Component } = await (
        importer as () => Promise<{ default: () => JSX.Element }>
      )();
      return { Component };
    };

    setRoute(segments, routes, (route) => {
      return add404ToRoute(route, notFoundLazy);
    });
  });
}
