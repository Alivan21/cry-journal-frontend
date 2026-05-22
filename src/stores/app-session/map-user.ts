import type { CurrentUserResponse } from "@/api/auth/type";

import type { AppSessionUser } from "./types";

type UserItem = CurrentUserResponse["data"];

export function mapUserToAppSession(user: UserItem): AppSessionUser {
  return {
    name: user.name,
    email: user.email,
  };
}
