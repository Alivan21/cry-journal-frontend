/** A dynamic import function for a route module. */
export type Importer = () => Promise<unknown>;

/**
 * Normalised representation of a single filesystem folder node inside `src/app`.
 * Built from glob results before any React Router objects are created.
 *
 * | Field        | Meaning                                                         |
 * |--------------|-----------------------------------------------------------------|
 * | `fsName`     | Raw folder name as it appears on disk, e.g. `(public)`, `[id]` |
 * | `urlSegment` | React Router path segment, or `null` for route groups           |
 * | `isGroup`    | `true` for `(name)` route-group folders                         |
 */
export interface ManifestNode {
  readonly fsName: string;
  readonly urlSegment: string | null;
  readonly isGroup: boolean;

  page?: Importer;
  layout?: Importer;
  loading?: Importer;
  error?: Importer;
  notFound?: Importer;

  children: Map<string, ManifestNode>;
}
