# App middleware

This SPA uses **React Router 7 Data-mode route middleware** on the **root** `RouteObject` produced by the file-based router in [`src/libs/react-router`](../src/libs/react-router/index.ts).

## Where it lives

- **Rules and wiring:** [`src/middleware.ts`](../src/middleware.ts)
- **Bootstrap:** [`src/main.tsx`](../src/main.tsx) calls `applyAppMiddleware(createRoutesFromFiles(...))` before `createBrowserRouter([routes])`.

### Example: bootstrap in `main.tsx`

```tsx
import { createBrowserRouter, RouterProvider } from "react-router";
import { createRoutesFromFiles } from "./libs/react-router/index.ts";
import { applyAppMiddleware } from "./middleware.ts";

const pageFiles = import.meta.glob("./app/**/*(page|layout).tsx");
// ... errorFiles, notFoundFiles, loadingFiles

const routes = applyAppMiddleware(
  createRoutesFromFiles(pageFiles, errorFiles, notFoundFiles, loadingFiles)
);

const router = createBrowserRouter([routes]);
```

## What `applyAppMiddleware` does

It attaches `appNavigationMiddleware` to the static root route’s `middleware` array. Middleware must be declared on the **static** route config; it cannot be returned from `lazy()` (React Router types mark `middleware` as unsupported inside lazy resolution).

### Example: minimal `applyAppMiddleware`

```ts
import type { RouteObject } from "react-router";

import { appNavigationMiddleware } from "./middleware"; // or define inline

export function applyAppMiddleware(root: RouteObject): RouteObject {
  const existing = root.middleware ?? [];
  root.middleware = [...existing, appNavigationMiddleware];
  return root;
}
```

## Auth behavior

One root middleware applies rules in this order (using [`ROUTES`](../src/common/constant/routes.ts)):

1. **Home** (`ROUTES.PUBLIC.HOME`, i.e. `/`): always allowed — guests and logged-in users both reach the page (no redirect).
2. **Private / app paths** (everything else that is not an “auth public” path below): require a session; otherwise redirect to login with a `redirect` query param.
3. **Auth public paths** (login, register, forgot password, etc. — `ROUTES.PUBLIC.*` except home): guests may use them; **logged-in users are redirected to** `ROUTES.PRIVATE.DASHBOARD`.

The auth-public list is a `const` tuple so new routes stay type-checked at the source.

### Example: root auth middleware (same idea as `appNavigationMiddleware`)

```ts
import { redirect, type MiddlewareFunction } from "react-router";

import { ROUTES } from "./common/constant/routes";

/* eslint-disable @typescript-eslint/only-throw-error */

export const appNavigationMiddleware: MiddlewareFunction = async ({ request }, next) => {
  const pathname = new URL(request.url).pathname;
  const auth = isAuthenticated(); // your session/JWT check

  if (pathname === ROUTES.PUBLIC.HOME || pathname === "") {
    return next();
  }

  if (!isPublicPath(pathname) && !auth) {
    throw redirect(`${ROUTES.PUBLIC.LOGIN}?redirect=${encodeURIComponent(pathname)}`);
  }

  if (isPublicPath(pathname) && auth) {
    throw redirect(ROUTES.PRIVATE.DASHBOARD);
  }

  return next();
};
```

## Migration from `registerMiddleware`

Previously, `src/libs/react-router/utils/middleware.ts` (removed) wrapped every page `loader` with `withMiddleware` and matched regex/function matchers against `pathname`.

### Before (removed pattern)

```ts
import { registerMiddleware } from "./libs/react-router";

registerMiddleware({
  matcher: "^/$",
  handler: () => ({ redirect: "/somewhere" }),
});

registerMiddleware({
  matcher: ".*",
  handler: (request) => {
    /* return { redirect } or undefined */
  },
});
```

### After (current pattern)

```ts
// src/middleware.ts — native MiddlewareFunction + throw redirect
export const appNavigationMiddleware: MiddlewareFunction = async ({ request }, next) => {
  // ...
  throw redirect("/login");
};

// applyAppMiddleware(root) pushes it onto root.middleware
```

Now:

- Matching is **structural**: the root route’s middleware runs for navigations that match a branch that includes that route (this tree’s root is `/` with children).
- Redirects use **`throw redirect(...)`** from `react-router`, not `{ redirect: string }` objects.

## Adding more middleware

1. Export a function that satisfies `MiddlewareFunction` from `react-router`.
2. Append it in `applyAppMiddleware` (order matters: **root array order** = execution order for that route; **parent routes** still run before child routes in the matched branch).

### Example: stack two middlewares on the root

```ts
import type { MiddlewareFunction, RouteObject } from "react-router";

const requestLoggingMiddleware: MiddlewareFunction = async ({ request }, next) => {
  console.log(request.method, request.url);
  return next();
};

export function applyAppMiddleware(root: RouteObject): RouteObject {
  root.middleware = [
    ...(root.middleware ?? []),
    requestLoggingMiddleware,
    appNavigationMiddleware,
  ];
  return root;
}
```

### Example: type-safe context (optional)

See the [official middleware guide](https://reactrouter.com/how-to/middleware). Sketch:

```ts
import { createContext, type MiddlewareFunction } from "react-router";

export const requestIdContext = createContext<string | null>(null);

export const withRequestIdMiddleware: MiddlewareFunction = async ({ context }, next) => {
  context.set(requestIdContext, crypto.randomUUID());
  return next();
};

// import { RouterContextProvider } from "react-router";
// createBrowserRouter(routes, {
//   getContext() {
//     return new RouterContextProvider();
//   },
// });
```

## Per-route (specific URL) middleware

React Router runs middleware for **every matched route in the branch**, parent first, then children ([Middleware how-to](https://reactrouter.com/how-to/middleware)). In this app, `middleware` must be set on the **static** `RouteObject` next to `lazy` — not inside the lazy-loaded module.

### Option A — attach by path segments (recommended)

After `createRoutesFromFiles`, use helpers from [`src/libs/react-router/utils/route.ts`](../src/libs/react-router/utils/route.ts):

- `appendMiddlewareForPath(root, ["app", "dashboard"], [myMiddleware])` — middleware on the route whose URL segment is `dashboard` under `app` (segment strings are `RouteObject.path` values from the generated tree).
- `appendMiddlewareForIndexPath(root, ["app", "dashboard"], [myMiddleware])` — middleware on the **`index: true`** leaf (typical `page.tsx` for that folder).

Call these from `applyAppMiddleware` (or right after it in `main.tsx`) so the tree is fully built first.

#### Example: dashboard-only middleware

```ts
import {
  appendMiddlewareForPath,
  appendMiddlewareForIndexPath,
} from "./libs/react-router";
import type { MiddlewareFunction, RouteObject } from "react-router";

const dashboardAuditMiddleware: MiddlewareFunction = async ({ request }, next) => {
  // Runs only when the matched branch includes this route (after root middleware).
  console.log("[dashboard]", request.url);
  return next();
};

export function applyAppMiddleware(root: RouteObject): RouteObject {
  root.middleware = [...(root.middleware ?? []), appNavigationMiddleware];

  // Middleware on the `path: "dashboard"` node under `path: "app"` (adjust to your real tree).
  appendMiddlewareForPath(root, ["app", "dashboard"], [dashboardAuditMiddleware]);

  // Or: only the index page under that folder (lazy page module).
  // appendMiddlewareForIndexPath(root, ["app", "dashboard"], [dashboardAuditMiddleware]);

  return root;
}
```

If a segment is missing at runtime, the helper throws — log `root` / `root.children` once while developing to confirm the exact `path` values the file router generated.

### Option B — pathname branching

Keep a single root middleware and branch on `pathname` before `return next()`. Simple, but all logic stays in one function.

#### Example

```ts
export const appNavigationMiddleware: MiddlewareFunction = async ({ request }, next) => {
  const pathname = new URL(request.url).pathname;

  if (pathname.startsWith("/app/settings")) {
    const allowed = await fetchFeatureFlags(); // example
    if (!allowed) throw redirect("/app/dashboard");
  }

  // ...rest of global auth rules...

  return next();
};
```

### Option C — `setRoute`

The same file exports `setRoute(segments, root, updater)` (used internally for error boundaries in [`handlers/error.tsx`](../src/libs/react-router/handlers/error.tsx)). The `segments` array shape matches what `getRouteSegmentsFromFilePath` produces for a file path; prefer `appendMiddlewareForPath` unless you already compute that array.

#### Example

```ts
import { getRouteSegmentsFromFilePath, setRoute } from "./libs/react-router";
import type { MiddlewareFunction, RouteObject } from "react-router";

const loginExtraMiddleware: MiddlewareFunction = async (_args, next) => next();

export function applyAppMiddleware(root: RouteObject): RouteObject {
  root.middleware = [...(root.middleware ?? []), appNavigationMiddleware];

  const segments = getRouteSegmentsFromFilePath(
    "./app/(public)/login/error.tsx", // example: same file you’d use for error boundary segments
    (_segment, prev) => prev
  );

  setRoute(segments, root, (route) => {
    route.middleware = [...(route.middleware ?? []), loginExtraMiddleware];
    return route;
  });

  return root;
}
```

Use the real segments for the route you target (often copied from how `addErrorElementToRoutes` builds them for a sibling `error.tsx` path). If this feels opaque, use **Option A** with explicit `["app", "dashboard"]` segments instead.
