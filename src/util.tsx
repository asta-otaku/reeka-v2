let cachedUserId: string | null = null;

export const CONSTANT = {
  BASE_URL: import.meta.env.VITE_BASE_URL,
  get USER_ID() {
    if (!cachedUserId) {
      const user = JSON.parse(sessionStorage.getItem("user") || "{}");
      cachedUserId = user._id || null;
    }
    return cachedUserId;
  },
};

export function logout() {
  sessionStorage.removeItem("user");
  cachedUserId = null;
}
