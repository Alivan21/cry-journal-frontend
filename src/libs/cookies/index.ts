import Cookies, { type CookieSetOptions } from "universal-cookie";

const DEFAULT_OPTIONS: CookieSetOptions = {
  path: "/",
  secure: import.meta.env.PROD,
  sameSite: "strict" as const,
};

const cookies = new Cookies(undefined, DEFAULT_OPTIONS);

export const SessionAuthCookies = {
  get: (): string | null | undefined => {
    return cookies.get<string>("session_auth");
  },
  set: (value: string, options?: Partial<CookieSetOptions>): void => {
    cookies.set("session_auth", value, { ...DEFAULT_OPTIONS, ...options });
  },
  remove: (): void => {
    cookies.remove("session_auth", { path: DEFAULT_OPTIONS.path });
  },
};
