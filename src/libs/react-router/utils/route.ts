import type { MiddlewareFunction, RouteObject } from "react-router";

/**
 * Walks the route tree from `root` following each segment as a child `path`
 * and appends the given middleware to that node's `middleware` array.
 *
 * Must be called **after** `createRoutesFromFiles` — React Router does not
 * allow `middleware` to be returned from inside a `lazy()` resolver.
 *
 * @example
 * // Attach auth guard to every route under /app
 * appendMiddlewareForPath(root, ["app"], [authMiddleware]);
 */
export function appendMiddlewareForPath(
  root: RouteObject,
  segments: string[],
  middleware: MiddlewareFunction[]
): void {
  let current: RouteObject = root;
  for (const segment of segments) {
    const child = current.children?.find((c) => c.path === segment);
    if (!child) {
      throw new Error(
        `appendMiddlewareForPath: no child with path "${segment}" under route "${String(current.path)}"`
      );
    }
    current = child;
  }
  current.middleware = [...(current.middleware ?? []), ...middleware];
}

/**
 * Same as {@link appendMiddlewareForPath}, but attaches middleware to the
 * `index: true` child of the node reached by `segments`.
 *
 * Useful when you need middleware on a folder's `page.tsx` index route rather
 * than on the layout route that wraps it.
 */
export function appendMiddlewareForIndexPath(
  root: RouteObject,
  segments: string[],
  middleware: MiddlewareFunction[]
): void {
  let current: RouteObject = root;
  for (const segment of segments) {
    const child = current.children?.find((c) => c.path === segment);
    if (!child) {
      throw new Error(
        `appendMiddlewareForIndexPath: no child with path "${segment}" under route "${String(current.path)}"`
      );
    }
    current = child;
  }
  const indexChild = current.children?.find((c) => c.index === true);
  if (!indexChild) {
    throw new Error(
      `appendMiddlewareForIndexPath: no index child under route "${String(current.path)}"`
    );
  }
  indexChild.middleware = [...(indexChild.middleware ?? []), ...middleware];
}
