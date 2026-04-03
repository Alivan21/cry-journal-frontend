# Routing guide

This boilerplate uses **React Router 7** in **Data mode** (`createBrowserRouter`) with a small **file-based route builder** under [`src/libs/react-router`](../src/libs/react-router/index.ts). Routes are defined by files under [`src/app/`](../src/app/), not by a hand-written `RouteObject` tree.

## How the router is built

Bootstrap happens in [`src/main.tsx`](../src/main.tsx):

1. **Globs** pick up route modules:
   - `page.tsx` / `layout.tsx` → [`import.meta.glob("./app/**/*(page|layout).tsx")`](../src/main.tsx)
   - `error.tsx` → `./app/**/*error.tsx`
   - `404.tsx` → `./app/**/*404.tsx`
   - `loading.tsx` → `./app/**/*loading.tsx`
2. Those maps are passed to **`createRoutesFromFiles`** from [`src/libs/react-router/index.ts`](../src/libs/react-router/index.ts), which:
   - Builds the nested `RouteObject` tree from page/layout files ([`convertPagesToRoute`](../src/libs/react-router/transformers/page.ts)).
   - Attaches **error boundaries** from `error.tsx` files ([`addErrorElementToRoutes`](../src/libs/react-router/handlers/error.tsx)).
   - Attaches **not-found** handling from `404.tsx` files ([`add404PageToRoutesChildren`](../src/libs/react-router/handlers/not-found.tsx)).
3. The returned root route is then passed to `createBrowserRouter` (your app may wrap the tree first—for example with middleware; see [See also](#see-also)).

## File conventions under `src/app/`

| File | Role |
|------|------|
| **`page.tsx`** | Route module for the **index** of that URL segment (the “page” for the folder). |
| **`layout.tsx`** | Shared shell for that segment and its children; merged with pages per [`mergeRoutes`](../src/libs/react-router/utils/route.ts). |
| **`error.tsx`** | Lazy `errorElement` on the route that **owns that folder’s URL segment** (sibling of `page`/`layout`, not a separate path). Implemented in [`handlers/error.tsx`](../src/libs/react-router/handlers/error.tsx). |
| **`404.tsx`** | Not-found UI injected as a **catch-all** (`path: "*"`) under that segment’s route. Implemented in [`handlers/not-found.tsx`](../src/libs/react-router/handlers/not-found.tsx). |
| **`loading.tsx`** | Fallback while the route’s lazy module resolves: used as `HydrateFallback` (and related loading handle) for `page`/`layout` in that folder or an ancestor. Resolution order is in [`findLoadingImporter`](../src/libs/react-router/utils/path.ts). |

Files only participate if they match the globs in `main.tsx` (correct name and extension).

### Route module exports (`page.tsx` / `layout.tsx`)

The builder uses React Router’s **route-level `lazy`**: each module is loaded on demand. The lazy resolver reads these exports (see [`PageModuleExports`](../src/libs/react-router/types/route.tsx) and [`createRouteLazy`](../src/libs/react-router/transformers/page.ts)):

- **`default`** — page or layout component (required).
- **`loader`** — optional React Router `loader`.
- **`action`** — optional React Router `action`.

## URL segments from folders

Segment rules are implemented in [`getRouteSegmentsFromFilePath`](../src/libs/react-router/utils/path.ts) (and `parseSegment` / `buildSegmentPath` in the same file). In practice:

| Folder / pattern | URL behavior |
|------------------|--------------|
| Plain folder, e.g. `app` | Fixed path segment: `/app/...` |
| **`[param]`** | Dynamic segment: `:param` |
| **`[...rest]`** | Splats / catch-all segment: `*` |
| **`(group)`** | **Optional** segment: inner name + `?` (React Router optional segment). Example: `(public)` → `public?`, so URLs may include or omit that segment depending on the rest of the path. |
| **`_name`** | **Ignored** for routing (filtered out), e.g. `_components` — use for colocated UI that must not become a URL segment. |
| **`(index)`** | Filtered out (reserved pattern in the builder). |

The glob paths are relative to `src/` (e.g. `./app/...`); the builder strips the `/app` portion when deriving segments.

**Boundary files (`error.tsx`, `404.tsx`):** segments are computed with [`getRouteSegmentsForBoundaryFile`](../src/libs/react-router/utils/path.ts) so the boundary attaches to the **route node for that directory**, not to a fake `error` or `404` path segment.

## Layout vs nested pages

[`mergeRoutes`](../src/libs/react-router/utils/route.ts) combines routes from multiple files:

- **Layouts** take precedence when merging at the same segment.
- If a segment first had only a **page** and later gains **children**, the existing page is often moved to an **`index: true`** child so nested routes can hang off the same segment.

For edge cases (duplicate index pages, etc.), the merge behavior is defined in that file—when in doubt, keep one `page.tsx` per route folder.

## Examples in this repo

These are the routes implied by the current [`src/app/`](../src/app/) tree:

| URL | Source file |
|-----|-------------|
| `/` | [`src/app/page.tsx`](../src/app/page.tsx) |
| `/login` (and paths consistent with optional `public?` from `(public)`) | [`src/app/(public)/login/page.tsx`](../src/app/%28public%29/login/page.tsx) |
| `/register` | [`src/app/(public)/register/page.tsx`](../src/app/%28public%29/register/page.tsx) |
| `/app/dashboard` | [`src/app/app/dashboard/page.tsx`](../src/app/app/dashboard/page.tsx) |
| `/app/users` | [`src/app/app/users/page.tsx`](../src/app/app/users/page.tsx) |

- Root-level [`src/app/error.tsx`](../src/app/error.tsx) and [`src/app/404.tsx`](../src/app/404.tsx) scope errors and not-found handling to the **root** route’s subtree when those globs pick them up.
- Adding `error.tsx` / `404.tsx` / `loading.tsx` **deeper** under `src/app/...` scopes them to that URL segment’s route node (see handlers above).

## Implementation map

| Concern | Location |
|--------|----------|
| Bootstrap + globs | [`src/main.tsx`](../src/main.tsx) |
| `createRoutesFromFiles` | [`src/libs/react-router/index.ts`](../src/libs/react-router/index.ts) |
| Page → `lazy` + loading fallback | [`src/libs/react-router/transformers/page.ts`](../src/libs/react-router/transformers/page.ts), [`src/libs/react-router/transformers/route.tsx`](../src/libs/react-router/transformers/route.tsx) |
| Segment parsing | [`src/libs/react-router/utils/path.ts`](../src/libs/react-router/utils/path.ts) |
| Tree merge / 404 attachment | [`src/libs/react-router/utils/route.ts`](../src/libs/react-router/utils/route.ts) |
| `error.tsx` handling | [`src/libs/react-router/handlers/error.tsx`](../src/libs/react-router/handlers/error.tsx) |
| `404.tsx` handling | [`src/libs/react-router/handlers/not-found.tsx`](../src/libs/react-router/handlers/not-found.tsx) |
| Types / exports | [`src/libs/react-router/types/route.tsx`](../src/libs/react-router/types/route.tsx) |

## See also

- [App middleware](./middleware-app.md) — how middleware is applied after the route tree is built.
- [React Router middleware](./middleware-react-router.md) — Data-mode middleware behavior in React Router.

These documents are **not** required to add pages or understand file-based URLs; use them when wiring auth, redirects, or per-route middleware.
