/**
 * Segment-level utilities that implement the Next.js App Router file-system
 * conventions for this SPA.
 *
 * Supported conventions
 * ─────────────────────
 * | Filesystem pattern | URL segment  | Behaviour                           |
 * |--------------------|--------------|-------------------------------------|
 * | `(group)`          | omitted      | Route group — organises layout only |
 * | `_folder`          | excluded     | Private — never routable            |
 * | `[param]`          | `:param`     | Dynamic segment                     |
 * | `[...slug]`        | `*`          | Catch-all splat                     |
 * | `[[...slug]]`      | `*`          | Optional catch-all (SPA compat)     |
 * | `segment`          | `segment`    | Static segment                      |
 *
 * Unsupported Next.js-only features (out of scope for this SPA):
 * `@slot`, `(.)intercept`, `(..)intercept`, `route.ts` API files,
 * server components, metadata files.
 */

/** Route-group folder: `(name)` — omitted from the URL path. */
export function isRouteGroup(segment: string): boolean {
  return segment.startsWith("(") && segment.endsWith(")");
}

/** Private folder: `_name` — excluded from routing entirely (safe for colocation). */
export function isPrivateSegment(segment: string): boolean {
  return segment.startsWith("_");
}

/**
 * Converts a filesystem folder segment to its React Router URL segment.
 *
 * Returns:
 * - `null`      → route group, omit from URL but keep in hierarchy
 * - `undefined` → private folder, exclude this file and all descendants
 * - `string`    → the URL path segment to use
 */
export function parseUrlSegment(fsSegment: string): string | null | undefined {
  if (isPrivateSegment(fsSegment)) return undefined;
  if (isRouteGroup(fsSegment)) return null;
  // Optional catch-all: [[...slug]] — treated as splat for SPA compatibility
  if (fsSegment.startsWith("[[...") && fsSegment.endsWith("]]")) return "*";
  // Catch-all: [...slug]
  if (fsSegment.startsWith("[...") && fsSegment.endsWith("]")) return "*";
  // Dynamic: [param]
  if (fsSegment.startsWith("[") && fsSegment.endsWith("]")) {
    return `:${fsSegment.slice(1, -1)}`;
  }
  return fsSegment;
}

/** The kind of a recognised route special file. */
export type RouteFileKind = "page" | "layout" | "loading" | "error" | "not-found";

/**
 * Classifies a route module filename into its kind.
 * `404.tsx` is accepted as a compatibility alias for `not-found.tsx`.
 */
export function classifyRouteFile(filename: string): RouteFileKind | null {
  const base = filename.replace(/\.(tsx?|jsx?)$/, "");
  switch (base) {
    case "page":
      return "page";
    case "layout":
      return "layout";
    case "loading":
      return "loading";
    case "error":
      return "error";
    case "not-found":
    case "404":
      return "not-found";
    default:
      return null;
  }
}
