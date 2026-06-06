import { decodeJwt } from "@/common/utils/jwt";
import { SessionAuthStorage } from "@/libs/local-storage";

/**
 * Checks if the stored session token is a decodable JWT.
 * @param token The stored session token.
 * @returns True if the token is a decodable JWT, false otherwise.
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
 * Returns whether the current session holds a decodable JWT (logged in).
 * @returns True if the session holds a decodable JWT, false otherwise.
 */
export function useAuth(): boolean {
  const token = SessionAuthStorage.get();
  return hasValidSessionToken(token);
}
