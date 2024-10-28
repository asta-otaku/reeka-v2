let cachedUserId: string | null = null;

export const CONSTANT = {
  BASE_URL: import.meta.env.VITE_BASE_URL,
  get USER_ID() {
    if (!cachedUserId) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      cachedUserId = "c2aa86e8-6def-4298-91a6-96f222734c9c"; //user._id || null;
    }
    return cachedUserId;
  },
};

export function logout() {
  localStorage.removeItem("user");
  cachedUserId = null;
}
