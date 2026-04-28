import type { JSX } from "react";
import type { RouteObject } from "react-router";
import { getRouteSegmentsForBoundaryFile } from "../utils/path";
import { setRoute } from "../utils/route";

type ErrorModule = { default: () => JSX.Element };
type LazyFn = () => Promise<Record<string, unknown>>;

/**
 * Attaches an `ErrorBoundary` to routes by composing it into each route's
 * existing `lazy()` result rather than using `React.lazy` + `errorElement`.
 *
 * This matches the idiomatic React Router 7 pattern: `lazy()` returns
 * `{ Component, loader, action, ErrorBoundary }` together, so the router can
 * co-locate all dynamic route properties without a separate Suspense boundary.
 */
export function addErrorElementToRoutes(
  errorFiles: Record<string, () => Promise<unknown>>,
  routes: RouteObject
): void {
  Object.entries(errorFiles).forEach(([filePath, importer]) => {
    const segments = getRouteSegmentsForBoundaryFile(filePath);

    setRoute(segments, routes, (route) => {
      // Cast to a plain async function so we can call and spread its result.
      // React Router's RouteObject.lazy is typed as a union that includes
      // non-callable variants, but in practice our builder always sets a
      // plain async function.
      const prevLazy = route.lazy as LazyFn | undefined;
      route.lazy = async () => {
        const [prevResult, errorModule] = (await Promise.all([
          prevLazy ? prevLazy() : Promise.resolve({}),
          importer(),
        ])) as [Record<string, unknown>, ErrorModule];
        return {
          ...prevResult,
          ErrorBoundary: errorModule.default,
        };
      };
      return route;
    });
  });
}
