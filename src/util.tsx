let cachedUserId: string | null = null;

export const CONSTANT = {
  BASE_URL: import.meta.env.VITE_BASE_URL,
  get USER_ID() {
    if (!cachedUserId) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      cachedUserId = "4d17d412-7344-4ffd-b893-b1ecaf35b0ea"; //user._id || null;
    }
    return cachedUserId;
  },
};

export function logout() {
  localStorage.removeItem("user");
  cachedUserId = null;
}
