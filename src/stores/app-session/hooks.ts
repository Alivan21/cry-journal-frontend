import { useShallow } from "zustand/react/shallow";

import { useAppSessionStore } from "./store";

export function useAppSession() {
  return useAppSessionStore(
    useShallow((state) => ({
      user: state.user,
      status: state.status,
      sessionLoaded: state.actions.sessionLoaded,
      sessionLoading: state.actions.sessionLoading,
      sessionFailed: state.actions.sessionFailed,
      sessionCleared: state.actions.sessionCleared,
    }))
  );
}
