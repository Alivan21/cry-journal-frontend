export const ROUTES = {
  PUBLIC: {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
  },
  PROTECTED: {
    DASHBOARD: "/dashboard",
    ACCOUNTS: {
      INDEX: "/accounts",
      CREATE: "/accounts/create",
      DETAIL: (id: string) => `/accounts/${id}`,
      EDIT: (id: string) => `/accounts/${id}/edit`,
      EDIT_ACCOUNT: (groupId: string, accountId: string) =>
        `/accounts/${groupId}/${accountId}/edit`,
    },
    USERS: "/users",
    SETTINGS: "/settings",
    PROFILE: "/profile",
  },
};
