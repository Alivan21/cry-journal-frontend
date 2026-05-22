import { useEffect } from "react";

import { authQueries } from "@/api/auth/query";
import { useQuery } from "@/hooks/request/use-query";

import { mapUserToAppSession } from "./map-user";
import { useAppSessionStore } from "./store";

/**
 * Syncs React Query `/auth/me` into the app session store for shell UI.
 * React Query remains the source of truth; this store is a view-model only.
 */
export function AppSessionSync() {
  const { data, isError, isPending } = useQuery(authQueries.getCurrentUserQuery());

  useEffect(() => {
    const { clearSession, setSession, setStatus } = useAppSessionStore.getState();

    if (isPending) {
      setStatus("loading");
      return;
    }

    if (isError || !data?.data) {
      clearSession();
      setStatus("error");
      return;
    }

    setSession(mapUserToAppSession(data.data));
  }, [data, isError, isPending]);

  return null;
}
