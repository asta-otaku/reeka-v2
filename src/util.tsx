let cachedUserId: string | null = null;

export const CONSTANT = {
  BASE_URL: import.meta.env.VITE_BASE_URL,
  get USER_ID() {
    if (!cachedUserId) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      cachedUserId = user._id || null;
    }
    return cachedUserId;
  },
};

export function logout() {
  localStorage.removeItem("user");
  cachedUserId = null;
}