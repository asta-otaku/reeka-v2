// apiClient.js
import axios from 'axios';
import { CONSTANT } from '../util';
import { toast } from "react-hot-toast";

// Function to get tokens from local storage
const getAccessToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");

// Create the Axios instance
const apiClient = axios.create({
  baseURL: CONSTANT.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to refresh the access token
const refreshAccessToken = async () => {
  try {
    const response = await axios.post(`${CONSTANT.BASE_URL}/auth/refresh-token`, {
      refreshToken: getRefreshToken(),
    });

    const newAccessToken = response.data.accessToken;
    if (newAccessToken) {
      localStorage.setItem("accessToken", newAccessToken);
      apiClient.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
    }
    return newAccessToken;
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    toast.error("Session expired. Please log in again.");
    window.location.href = "/signin";
    throw error;
  }
};

// Interceptor to add Authorization header
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

// Interceptor to handle 401 responses
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401 && !error.config._retry) {
      error.config._retry = true; // Prevent infinite loop
      try {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return apiClient(error.config); // Retry the original request
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
