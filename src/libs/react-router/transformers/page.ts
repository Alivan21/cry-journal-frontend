import type { Importer } from "../types/manifest";
import type { ActionFunction, LoaderFunction } from "react-router";

type PageModuleExports = {
  default: () => React.JSX.Element;
  loader?: LoaderFunction;
  action?: ActionFunction;
};

type LazyRouteReturn = {
  Component: () => React.JSX.Element;
  loader?: LoaderFunction;
  action?: ActionFunction;
};

/**
 * Wraps a dynamic `import()` function in a React Router route-level `lazy()`
 * compatible function.  Resolves `Component`, `loader`, and `action` from the
 * module's named exports so each route is code-split automatically.
 */
export function createLazy(importer: Importer): () => Promise<LazyRouteReturn> {
  return async () => {
    const mod = (await importer()) as PageModuleExports;
    return {
      Component: mod.default,
      loader: mod.loader,
      action: mod.action,
    };
  };
}
