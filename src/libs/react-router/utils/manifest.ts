import type { Importer, ManifestNode } from "../types/manifest";
import { classifyRouteFile, isPrivateSegment, isRouteGroup, parseUrlSegment } from "./path";

function createNode(fsName: string): ManifestNode {
  const parsed = parseUrlSegment(fsName);
  return {
    fsName,
    // Private segments should never reach here, but guard defensively
    urlSegment: parsed === undefined ? null : parsed,
    isGroup: isRouteGroup(fsName),
    children: new Map(),
  };
}

/**
 * Builds a {@link ManifestNode} tree from a flat map of file-path → importer
 * produced by `import.meta.glob`.
 *
 * File paths are expected in the form `./app/.../<special-file>.tsx` where
 * `<special-file>` is one of: `page`, `layout`, `loading`, `error`,
 * `not-found`, or `404` (compatibility alias for `not-found`).
 *
 * Next.js App Router conventions applied during parsing:
 * - `(group)` folders are route groups — omitted from the URL, present in the tree
 * - `_private` folders are excluded from routing entirely (safe colocation)
 * - `[param]` → `:param` dynamic segment
 * - `[...slug]` / `[[...slug]]` → `*` splat (catch-all)
 */
export function buildManifest(files: Record<string, Importer>): ManifestNode {
  const root: ManifestNode = {
    fsName: "",
    urlSegment: "/",
    isGroup: false,
    children: new Map(),
  };

  for (const [filePath, importer] of Object.entries(files)) {
    // e.g. "./app/(public)/login/page.tsx" → "(public)/login/page.tsx"
    const relative = filePath.replace(/^\.\/app\//, "");
    const parts = relative.split("/");
    const filename = parts[parts.length - 1];
    const dirSegments = parts.slice(0, -1);

    const fileKind = classifyRouteFile(filename);
    if (!fileKind) continue;

    let current: ManifestNode | null = root;

    for (const seg of dirSegments) {
      if (!current) break;

      if (isPrivateSegment(seg)) {
        current = null; // skip this file: it is inside a private folder
        break;
      }

      if (!current.children.has(seg)) {
        current.children.set(seg, createNode(seg));
      }

      current = current.children.get(seg)!;
    }

    if (!current) continue;

    switch (fileKind) {
      case "page":
        current.page = importer;
        break;
      case "layout":
        current.layout = importer;
        break;
      case "loading":
        current.loading = importer;
        break;
      case "error":
        current.error = importer;
        break;
      case "not-found":
        current.notFound = importer;
        break;
    }
  }

  return root;
}
