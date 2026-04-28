import { PATH_SEPARATOR } from "../types/route";

/**
 * Processes a file path to generate route segments, handling various routing patterns.
 *
 * @param filePath - The file path to process
 * @param transformer - Optional function to transform segment names
 * @returns Array of processed route segments
 */
export function getRouteSegmentsFromFilePath(
  filePath: string,
  transformer?: (segment: string, prevSegment: string) => string
): string[] {
  const defaultTransformer = (segment: string, prevSegment: string): string =>
    `${prevSegment}${PATH_SEPARATOR}${segment.split(".")[0]}`;

  const actualTransformer = transformer || defaultTransformer;

  const segments = filePath
    .replace("/app", "")
    .split("/")
    .filter(
      (segment) =>
        // Skip underscore-prefixed folders (colocated non-route files)
        !segment.startsWith("_") &&
        // Skip route-group folders (e.g. (public), (auth)) — they have no URL contribution
        !(segment.startsWith("(") && segment.endsWith(")"))
    )
    .map((segment) => parseSegment(segment));

  return buildSegmentPath(segments[0], segments, actualTransformer);
}

/**
 * Converts a single file-path segment to its React Router path equivalent.
 *
 * Route-group folders `(group)` are already filtered before this is called,
 * so this only handles the remaining segment types.
 */
function parseSegment(segment: string): string {
  if (segment.startsWith(".")) return "/";
  if (segment.startsWith("[...")) return "*";
  if (segment.startsWith("[")) return segment.replace("[", ":").replace("]", "");
  return segment;
}

/**
 * Builds segment path using a transformer function.
 */
export function buildSegmentPath(
  firstSegment: string,
  segments: string[],
  transformer: (seg: string, prev: string) => string,
  entries: string[] = [],
  index = 0
): string[] {
  if (index >= segments.length) {
    return entries;
  }

  const segment = segments[index];
  const isLastSegment = index === segments.length - 1;

  if (isLastSegment) {
    const lastEntry = entries.pop() || "";
    entries.push(transformer(segment, lastEntry));
    return entries;
  }

  const nextIndex = index + 1;

  if (!segment.startsWith(":")) {
    entries.push(segment);
  } else {
    const lastEntry = entries.pop() || "";
    entries.push(`${lastEntry}/${segment}`);
  }

  return buildSegmentPath(firstSegment, segments, transformer, entries, nextIndex);
}

/**
 * Checks if a route is a dynamic parameter route.
 */
export function isDynamicRoute(path: string): boolean {
  return path.startsWith(":");
}

/**
 * Directory of a route module (glob key without the filename), e.g.
 * `./app/(public)/login/page.tsx` → `./app/(public)/login`.
 */
export function getRouteDirectory(filePath: string): string {
  const trimmed = filePath.replace(/\/$/, "");
  const lastSlash = trimmed.lastIndexOf("/");
  if (lastSlash === -1) return ".";
  return trimmed.slice(0, lastSlash);
}

/**
 * Parent directory when walking up from a path under `./app/...`. Stops at `./app`.
 */
function getParentRouteDirectory(dir: string): string | null {
  const d = dir.replace(/\/$/, "");
  if (d === "./app") return null;
  const i = d.lastIndexOf("/");
  if (i <= 1) return null;
  return d.slice(0, i);
}

/**
 * Closest `loading.tsx` for a page/layout file: same folder first, then each ancestor
 * up to and including `./app`, using keys exactly as in `import.meta.glob`.
 */
export function findLoadingImporter(
  pageOrLayoutFilePath: string,
  loadingFiles: Record<string, () => Promise<unknown>>
): (() => Promise<unknown>) | undefined {
  let dir = getRouteDirectory(pageOrLayoutFilePath);
  while (true) {
    const key = `${dir}/loading.tsx`;
    const importer = loadingFiles[key];
    if (importer) return importer;
    if (dir === "./app") return undefined;
    const parent = getParentRouteDirectory(dir);
    if (!parent) return undefined;
    dir = parent;
  }
}

/**
 * Route segments for `setRoute` when attaching `error.tsx` / `404.tsx` to the node
 * that owns that URL segment (folder), not the synthetic `…\\error` leaf.
 */
export function getRouteSegmentsForBoundaryFile(filePath: string): string[] {
  return getRouteSegmentsFromFilePath(
    filePath,
    (_segment: string, prev: string) => prev
  );
}
