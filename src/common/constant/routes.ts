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
      EDIT: (id: string) => `/accounts/${id}/edit`,
    },
    USERS: "/users",
    SETTINGS: "/settings",
    PROFILE: "/profile",
  },
};
