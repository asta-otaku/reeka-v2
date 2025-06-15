let cachedUserId: string | null = null;
import Cookies from "js-cookie";

export const CONSTANT = {
  BASE_URL: import.meta.env.VITE_BASE_URL,
  get USER_ID() {
    if (!cachedUserId) {
      const user = JSON.parse(Cookies.getI("user") || "{}");
      cachedUserId = user._id || null;
    }
    return cachedUserId;
  },
};

export function logout() {
  Cookies.remove("user");
  cachedUserId = null;
}
