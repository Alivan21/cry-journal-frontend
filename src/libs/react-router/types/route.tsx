import type { JSX } from "react";
import type { ActionFunction, LoaderFunction, RouteObject } from "react-router";

/** Expected exports from a route `page.tsx` or `layout.tsx` module. */
export type PageModuleExports = {
  default: () => JSX.Element;
  loader?: LoaderFunction;
  action?: ActionFunction;
};

/** Shape returned by a React Router route-level `lazy()` function. */
export type LazyRouteReturn = {
  Component: () => JSX.Element;
  loader?: LoaderFunction;
  action?: ActionFunction;
};

/** Per-route metadata attached via React Router's `handle` field. */
export type RouteHandle = {
  pageType: "page" | "layout";
};

/** `RouteObject` extended with typed `handle` for this project. */
export type AppRouteObject = Omit<RouteObject, "handle" | "children"> & {
  handle?: RouteHandle;
  children?: AppRouteObject[];
};
