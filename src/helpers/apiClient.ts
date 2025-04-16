// apiClient.js
import axios from 'axios';
import { CONSTANT } from '../util';
import { toast } from "react-hot-toast";

// Helper functions for tokens
const getAccessToken = () => sessionStorage.getItem("accessToken");
const getRefreshToken = () => sessionStorage.getItem("refreshToken");

const apiClient = axios.create({
  baseURL: CONSTANT.BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      `${CONSTANT.BASE_URL}/auth/refresh-token`,
      { refreshToken: getRefreshToken() }
    );

    const newAccessToken = response.data.newAccessToken;
    if (newAccessToken) {
      sessionStorage.setItem("accessToken", newAccessToken);
      apiClient.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
    }
    return newAccessToken;
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    toast.error("Session expired. Please log in again.");
    // Capture current URL so the user can be routed back after signin
    const currentUrl = window.location.pathname + window.location.search;
    window.location.href = `/signin?redirectUrl=${encodeURIComponent(currentUrl)}`;
    throw error;
  }
};

// Add request interceptor to attach access token
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle 401 errors (and refresh once)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response &&
        error.response.status === 401 &&
        !error.config._retry) {
      error.config._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return apiClient(error.config);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
