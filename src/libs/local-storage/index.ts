const SESSION_AUTH_KEY = "session_auth";

type SessionAuthStorageOptions = {
  maxAge?: number;
};

type StoredSession = {
  token: string;
  expiresAt: number | null;
};

function readStoredSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(SESSION_AUTH_KEY);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

export const SessionAuthStorage = {
  get: (): string | null | undefined => {
    const stored = readStoredSession();
    if (!stored) {
      return null;
    }

    if (stored.expiresAt !== null && Date.now() >= stored.expiresAt) {
      SessionAuthStorage.remove();
      return null;
    }

    return stored.token;
  },
  set: (value: string, options?: SessionAuthStorageOptions): void => {
    const expiresAt =
      options?.maxAge !== undefined ? Date.now() + options.maxAge * 1000 : null;

    const payload: StoredSession = { token: value, expiresAt };
    localStorage.setItem(SESSION_AUTH_KEY, JSON.stringify(payload));
  },
  remove: (): void => {
    localStorage.removeItem(SESSION_AUTH_KEY);
  },
};
