import { redirect, type MiddlewareFunction, type RouteObject } from "react-router";

import { ROUTES } from "./common/constant/routes";
import { decodeJwt } from "./common/utils/jwt";
import { SessionAuthStorage } from "./libs/local-storage";

/** Public paths derived from ROUTES — used for auth gating. */
const PUBLIC_ROUTE_PATHS = [ROUTES.PUBLIC.LOGIN, ROUTES.PUBLIC.REGISTER] as const;

function isHomePath(pathname: string): boolean {
  return pathname === ROUTES.PUBLIC.HOME || pathname === "";
}

/** Auth-related public routes: logged-in users are sent to the app. Home is not included. */
function isPublicPath(pathname: string): boolean {
  return PUBLIC_ROUTE_PATHS.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function isAuthenticated(): boolean {
  const token = SessionAuthStorage.get();
  return Boolean(token && decodeJwt(token) !== null);
}

/**
 * - Home (`ROUTES.PUBLIC.HOME`): guests go to login; logged-in users → dashboard.
 * - Auth public routes (login, register, …): guests allowed; logged-in users → dashboard.
 * - Other routes: require auth or redirect to login with `redirect` query.
 */
export const appNavigationMiddleware: MiddlewareFunction = async ({ request }, next) => {
  const pathname = new URL(request.url).pathname;
  const auth = isAuthenticated();

  if (!isPublicPath(pathname) && !auth) {
    if (isHomePath(pathname)) {
      return redirect(ROUTES.PUBLIC.LOGIN);
    }
    return redirect(`${ROUTES.PUBLIC.LOGIN}?redirect=${encodeURIComponent(pathname)}`);
  }

  if (auth && (isHomePath(pathname) || isPublicPath(pathname))) {
    return redirect(ROUTES.PROTECTED.DASHBOARD);
  }

  return next();
};

/**
 * Attaches app middleware to the file-generated route tree. Middleware must live on
 * the static {@link RouteObject} (not inside `lazy()`), alongside `lazy` / `children`.
 */
export function applyAppMiddleware(root: RouteObject): RouteObject {
  const existing = root.middleware ?? [];
  root.middleware = [...existing, appNavigationMiddleware];
  return root;
}
