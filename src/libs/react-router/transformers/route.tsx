import type { JSX } from "react";
import type { ActionFunction, LoaderFunction } from "react-router";
import { type ExtendedRouteObject, PATH_SEPARATOR } from "../types/route";
import { isDynamicRoute } from "../utils/path";

type LazyRouteFn = () => Promise<{
  Component: () => JSX.Element;
  loader?: LoaderFunction;
  action?: ActionFunction;
}>;

type CreateRouteLazyArgs = {
  segments: string[];
  lazy: LazyRouteFn;
};

/**
 * Creates a new route configuration for a path segment and its lazy module.
 *
 * `HydrateFallback` is intentionally omitted here: per-route hydration
 * fallbacks are only appropriate when a route has a `clientLoader` with
 * `hydrate = true` (SSR/RSC pattern).  For client-side navigation loading
 * feedback, use `useNavigation()` in a layout component instead.
 */
export function createRoute(args: CreateRouteLazyArgs): ExtendedRouteObject {
  const [current, ...rest] = args.segments;
  const [cleanPath, pageType] = current.split(PATH_SEPARATOR);
  const route: ExtendedRouteObject = { path: cleanPath };

  if (pageType === "page" || pageType === "layout") {
    route.lazy = args.lazy;
    route.handle = { pageType };
  }

  if (rest.length > 0) {
    handleNestedRoutes(route, rest, args);
  }

  return route;
}

function handleNestedRoutes(
  route: ExtendedRouteObject,
  rest: string[],
  args: CreateRouteLazyArgs
): void {
  const nextSegment = rest[0].split(PATH_SEPARATOR)[0];
  const cleanPath = route.path ?? "";

  if (isDynamicRoute(cleanPath)) {
    route.children = route.children ?? [];
    route.children.push(createNestedRoute(nextSegment, args));
    return;
  }

  const childRoute = createRoute({ ...args, segments: rest });
  route.children = route.children ?? [];
  route.children.push(childRoute);
}

/**
 * Creates a nested route for a dynamic path segment (e.g. `[id]`).
 */
export function createNestedRoute(
  editSegment: string,
  args: CreateRouteLazyArgs
): ExtendedRouteObject {
  return {
    path: editSegment,
    lazy: args.lazy,
    handle: { pageType: "page" },
  };
}
