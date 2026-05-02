import type { RouteObject } from "react-router";
import { applyAppMiddleware } from "../../middleware";
import { manifestToRootRoute } from "./transformers/route";
import { buildManifest } from "./utils/manifest";

/**
 * Converts a flat map of route-file importers produced by Vite's
 * `import.meta.glob` into a single root `RouteObject` ready for
 * `createBrowserRouter([routes])`.
 *
 * Recognised filenames — Next.js App Router conventions:
 * - `page.tsx`      — page component for the current URL segment
 * - `layout.tsx`    — layout that wraps the segment and all its children
 * - `loading.tsx`   — `HydrateFallback` shown while the route lazy-loads
 * - `error.tsx`     — React error boundary for the segment
 * - `not-found.tsx` — catch-all shown for unmatched paths
 * - `404.tsx`       — compatibility alias for `not-found.tsx`
 *
 * Folder conventions:
 * - `(group)/`   — route group: organises layouts without affecting the URL
 * - `_private/`  — private folder: excluded from routing, safe for colocation
 * - `[param]/`   — dynamic segment, maps to React Router `:param`
 * - `[...slug]/` — catch-all segment, maps to React Router splat
 *
 * @param routeFiles Record produced by `import.meta.glob` targeting the
 *   recognised special filenames inside `./app`.
 */
export function createRoutesFromFiles(
  routeFiles: Record<string, () => Promise<unknown>>
): RouteObject {
  const manifest = buildManifest(routeFiles);
  const routes = manifestToRootRoute(manifest);
  return applyAppMiddleware(routes);
}

// Route-tree utilities for post-build middleware attachment
export { appendMiddlewareForPath, appendMiddlewareForIndexPath } from "./utils/route";

// Segment parsing utilities (useful for consumers extending the router)
export { isRouteGroup, isPrivateSegment, parseUrlSegment, classifyRouteFile } from "./utils/path";
export type { RouteFileKind } from "./utils/path";

// Manifest types (useful for consumers who need to inspect the tree)
export type { ManifestNode, Importer } from "./types/manifest";

// Route types
export type {
  PageModuleExports,
  LazyRouteReturn,
  RouteHandle,
  AppRouteObject,
} from "./types/route";
