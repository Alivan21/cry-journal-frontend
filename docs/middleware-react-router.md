# React Router middleware (how it works)

Official reference: [Middleware | React Router](https://reactrouter.com/how-to/middleware).

## Data mode vs framework mode

This project is a **Vite SPA** using `createBrowserRouter` (**Data mode**). Middleware runs in the **browser** for client navigations and fetcher-driven loads. Framework-mode-only topics (server document requests, `getLoadContext`, `future.v8_middleware` on the server) are described in the same doc but do not apply to this app’s deployment shape.

## Where middleware is configured

In Data mode, routes are objects with an optional **`middleware`** array:

```ts
{
  path: "/",
  middleware: [myMiddleware],
  children: [/* ... */],
}
```

Each function matches the **`MiddlewareFunction`** type: it receives the same core arguments as a loader (`request`, `params`, `context`) plus a **`next`** callback.

## Execution order

For a matched branch, middleware runs **down** the tree (parent → child), then **`next()`** eventually runs loaders/actions, then completion unwinds **up**. You can run code before `await next()` and after.

## `next()` and redirects

- Call **`next()`** once when the request should continue to downstream middleware and loaders.
- **`throw redirect(url)`** short-circuits like a throwing loader; the client pipeline treats redirect responses accordingly.
- If you only need pre-handler work (e.g. auth gate), you can omit calling `next()` in some patterns; when in doubt, follow the examples in the [official doc](https://reactrouter.com/how-to/middleware).

## Context and `getContext`

`context` in middleware/loaders is backed by **`RouterContextProvider`**. The router creates a fresh provider per navigation when you don’t pass **`getContext`**; you can pass `getContext` to `createBrowserRouter` to seed shared state.

**TypeScript:** opting into stricter `context` typing is done via module augmentation of the `Future` interface (`v8_middleware`) as described in the official guide. This app does not require that unless you want loaders/actions typed against `context.get(...)` tokens.

## Lazy routes

`middleware` must live on the **static** `RouteObject` next to `lazy`, not inside the object returned from `lazy()`. The file-based builder in this repo sets `lazy` per page; app-level middleware is attached in [`src/middleware.ts`](../src/middleware.ts) after the tree is built.

## Implementation pointer (library code)

React Router’s client pipeline uses a default data strategy that, when any matched route defines `middleware`, runs **`runClientMiddlewarePipeline`** before ordinary loader execution. That logic lives in the published `react-router` package bundle (e.g. `defaultDataStrategyWithMiddleware` / `runMiddlewarePipeline` in the compiled router chunk). You normally do not import these; they are useful only when reading behavior or debugging.
