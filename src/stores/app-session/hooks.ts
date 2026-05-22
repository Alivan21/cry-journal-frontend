import { useShallow } from "zustand/react/shallow";

import { useAppSessionStore } from "./store";

/**
 * Current user and load state for shell UI (profile menu, etc.).
 * Populated by `<AppSessionSync />` from React Query `/auth/me`.
 *
 * @example
 * const { user, status } = useAppSession();
 * const displayName = user?.name ?? "Profile";
 */
export function useAppSession() {
  return useAppSessionStore(
    useShallow((state) => ({
      user: state.user,
      status: state.status,
    }))
  );
}
