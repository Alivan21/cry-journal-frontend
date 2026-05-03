import { decodeJwt } from "@/common/utils/jwt";
import { SessionAuthCookies } from "@/libs/cookies";

/**
 * Checks if the session cookie holds a decodable JWT.
 * @param token The session cookie value.
 * @returns True if the session cookie holds a decodable JWT, false otherwise.
 */
function hasValidSessionToken(token: string | null | undefined): boolean {
  if (!token) return false;
  try {
    decodeJwt(token);
    return true;
  } catch {
    return false;
  }
}

/**
 * Returns whether the current session cookie holds a decodable JWT (logged in).
 * @returns True if the session cookie holds a decodable JWT, false otherwise.
 */
export function useAuth(): boolean {
  const token = SessionAuthCookies.get();
  return hasValidSessionToken(token);
}
