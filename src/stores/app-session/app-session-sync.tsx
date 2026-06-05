import { useEffect } from "react";

import { authQueries } from "@/api/auth/query";
import { useQuery } from "@/hooks/request/use-query";

import { useAppSessionStore } from "./store";

/**
 * Syncs React Query `/auth/me` into the app session store for shell UI.
 * React Query remains the source of truth; this store is a view-model only.
 */
export function AppSessionSync() {
  const { data, isError, isPending } = useQuery(authQueries.getCurrentUserQuery());

  useEffect(() => {
    const { sessionFailed, sessionLoaded, sessionLoading } = useAppSessionStore.getState().actions;

    if (isPending) {
      sessionLoading();
      return;
    }

    if (isError || !data?.data) {
      sessionFailed();
      return;
    }

    sessionLoaded({
      name: data.data.name,
      email: data.data.email,
    });
  }, [data, isError, isPending]);

  return null;
}
