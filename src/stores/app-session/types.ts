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
  setSession: (user: AppSessionUser) => void;
  setStatus: (status: AppSessionStatus) => void;
  clearSession: () => void;
};

export type AppSessionStore = AppSessionState & AppSessionActions;
