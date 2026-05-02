import { lazy } from "react";
import type { Importer, ManifestNode } from "../types/manifest";
import type { JSX } from "react";
import type { RouteObject } from "react-router";
import { createLazy } from "./page";

// eslint-disable-next-line react-refresh/only-export-components
const DEFAULT_FALLBACK = (): JSX.Element => <div>Loading...</div>;

/** Creates a lazy-loaded `HydrateFallback` component from a `loading.tsx` importer. */
function makeLazyFallback(importer: Importer): React.ComponentType {
  return lazy(importer as () => Promise<{ default: React.ComponentType }>);
}

/** Creates a lazy `errorElement` JSX node from an `error.tsx` importer. */
function makeErrorElement(importer: Importer): JSX.Element {
  const Boundary = lazy(importer as () => Promise<{ default: () => JSX.Element }>);
  return <Boundary />;
}

/** Creates a lazy `element` JSX node from a `not-found.tsx` / `404.tsx` importer. */
function makeNotFoundElement(importer: Importer): JSX.Element {
  const NotFound = lazy(importer as () => Promise<{ default: () => JSX.Element }>);
  return <NotFound />;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Converts the root {@link ManifestNode} (representing `src/app/`) into a
 * single React Router `RouteObject` at `path: "/"` ready for
 * `createBrowserRouter([rootRoute])`.
 *
 * Component hierarchy per route (mirrors Next.js App Router):
 * ```
 * layout.tsx  (if present — wraps children)
 *   error.tsx (React error boundary)
 *     loading.tsx (HydrateFallback / Suspense)
 *       page.tsx  (index child) | nested layout
 * ```
 */
export function manifestToRootRoute(root: ManifestNode): RouteObject {
  const loadingFallback = root.loading ? makeLazyFallback(root.loading) : DEFAULT_FALLBACK;
  const childRoutes = collectChildRoutes(root, root.loading);

  const rootRoute: RouteObject = { path: "/" };

  if (root.layout) {
    rootRoute.lazy = createLazy(root.layout);
    rootRoute.HydrateFallback = loadingFallback;
  }

  if (root.error) {
    rootRoute.errorElement = makeErrorElement(root.error);
  }

  rootRoute.children = [];

  if (root.page) {
    rootRoute.children.push({
      index: true,
      lazy: createLazy(root.page),
      HydrateFallback: loadingFallback,
    });
  }

  rootRoute.children.push(...childRoutes);

  if (root.notFound) {
    rootRoute.children.push({ path: "*", element: makeNotFoundElement(root.notFound) });
  }

  return rootRoute;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

/** Recursively converts all children of a node to RouteObjects. */
function collectChildRoutes(node: ManifestNode, inheritedLoading?: Importer): RouteObject[] {
  const results: RouteObject[] = [];
  for (const child of node.children.values()) {
    results.push(...nodeToRouteObjects(child, inheritedLoading));
  }
  return results;
}

/**
 * Converts a single {@link ManifestNode} to zero or more `RouteObject`s.
 *
 * A route-group node with no layout is *transparent* — it returns its
 * children directly so they appear as siblings in the parent's `children`.
 */
function nodeToRouteObjects(node: ManifestNode, inheritedLoading?: Importer): RouteObject[] {
  const effectiveLoading = node.loading ?? inheritedLoading;
  const loadingFallback = effectiveLoading ? makeLazyFallback(effectiveLoading) : DEFAULT_FALLBACK;
  const childRoutes = collectChildRoutes(node, effectiveLoading);

  if (node.isGroup) {
    return buildGroupRoutes(node, childRoutes, loadingFallback);
  }

  if (node.urlSegment === null) {
    return []; // private segment guard — should not reach here
  }

  return [buildSegmentRoute(node, childRoutes, loadingFallback)];
}

/**
 * Handles `(group)` folders:
 * - With `layout.tsx` → produces a single **pathless** layout `RouteObject`
 * - Without `layout.tsx` → transparent; returns children unchanged
 */
function buildGroupRoutes(
  node: ManifestNode,
  childRoutes: RouteObject[],
  loadingFallback: React.ComponentType
): RouteObject[] {
  if (!node.layout) {
    // Transparent group — lift children to parent level unchanged
    return childRoutes;
  }

  const route: RouteObject = {
    lazy: createLazy(node.layout),
    HydrateFallback: loadingFallback,
    children: [],
  };

  if (node.error) route.errorElement = makeErrorElement(node.error);

  if (node.page) {
    route.children!.push({
      index: true,
      lazy: createLazy(node.page),
      HydrateFallback: loadingFallback,
    });
  }

  route.children!.push(...childRoutes);

  if (node.notFound) {
    route.children!.push({ path: "*", element: makeNotFoundElement(node.notFound) });
  }

  return [route];
}

/**
 * Builds a `RouteObject` for a regular (non-group) path segment.
 *
 * Merging rules (matching Next.js App Router hierarchy):
 * - `layout.tsx` present → the segment route owns the layout and wraps children
 * - `page.tsx` alongside `layout.tsx` → becomes `{ index: true }` child of layout
 * - `page.tsx` alone with children → wrapper route + `{ index: true }` child
 * - `page.tsx` alone, no children → simple leaf route
 */
function buildSegmentRoute(
  node: ManifestNode,
  childRoutes: RouteObject[],
  loadingFallback: React.ComponentType
): RouteObject {
  const path = node.urlSegment!;

  if (node.layout) {
    const route: RouteObject = {
      path,
      lazy: createLazy(node.layout),
      HydrateFallback: loadingFallback,
      children: [],
    };

    if (node.error) route.errorElement = makeErrorElement(node.error);

    if (node.page) {
      route.children!.push({
        index: true,
        lazy: createLazy(node.page),
        HydrateFallback: loadingFallback,
      });
    }

    route.children!.push(...childRoutes);

    if (node.notFound) {
      route.children!.push({ path: "*", element: makeNotFoundElement(node.notFound) });
    }

    return route;
  }

  // No layout — determine whether children require a wrapper route
  const hasPage = !!node.page;
  const hasChildren = childRoutes.length > 0;
  const hasNotFound = !!node.notFound;

  if (hasPage && !hasChildren && !hasNotFound) {
    // Simple leaf page — no wrapper needed
    const route: RouteObject = {
      path,
      lazy: createLazy(node.page!),
      HydrateFallback: loadingFallback,
    };
    if (node.error) route.errorElement = makeErrorElement(node.error);
    return route;
  }

  // Page exists alongside children or not-found → need a wrapper with index child
  const children: RouteObject[] = [];

  if (hasPage) {
    children.push({
      index: true,
      lazy: createLazy(node.page!),
      HydrateFallback: loadingFallback,
    });
  }

  children.push(...childRoutes);

  if (hasNotFound) {
    children.push({ path: "*", element: makeNotFoundElement(node.notFound!) });
  }

  const route: RouteObject = { path, children };
  if (node.error) route.errorElement = makeErrorElement(node.error);
  return route;
}
