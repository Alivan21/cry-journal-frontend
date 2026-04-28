import type { JSX } from "react";
import type { ActionFunction, LoaderFunction, RouteObject } from "react-router";

/**
 * Represents the expected exports of a page or layout route module.
 */
export type PageModuleExports = {
  default: () => JSX.Element;
  loader?: LoaderFunction;
  action?: ActionFunction;
  /** Named export that becomes the route's ErrorBoundary. */
  ErrorBoundary?: () => JSX.Element;
};

/**
 * The partial route config returned by a route's `lazy()` function.
 * React Router merges these fields onto the static route object on navigation.
 */
export type LazyRouteReturn = {
  Component: () => JSX.Element;
  loader?: LoaderFunction;
  action?: ActionFunction;
  /** Optional error boundary component for this route. */
  ErrorBoundary?: () => JSX.Element;
};

/**
 * Defines the type of page in the routing system.
 */
export type RouteHandle = {
  pageType: "page" | "layout";
};

/**
 * Extends the base RouteObject with the typed `handle` field used by this
 * file-based router. All other route properties come from React Router's own
 * `RouteObject` — no custom fallback or loading fields are added here.
 */
export type ExtendedRouteObject = Omit<RouteObject, "handle" | "children"> & {
  handle?: RouteHandle;
  children?: ExtendedRouteObject[];
};

export type PageModule = () => Promise<PageModuleExports>;
export type RouteUpdater = (route: RouteObject) => RouteObject;

export const PATH_SEPARATOR = "\\";
