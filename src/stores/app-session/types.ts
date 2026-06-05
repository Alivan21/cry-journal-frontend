export type AppSessionStatus = "idle" | "loading" | "ready" | "error";

export type AppSessionUser = {
  name?: string;
  email?: string;
  avatarSrc?: string;
};

export type AppSessionState = {
  user: AppSessionUser | null;
  status: AppSessionStatus;
};

export type AppSessionActions = {
  sessionLoaded: (user: AppSessionUser) => void;
  sessionLoading: () => void;
  sessionFailed: () => void;
  sessionCleared: () => void;
};

export type AppSessionStore = AppSessionState & {
  actions: AppSessionActions;
};
