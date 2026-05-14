import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import { toast } from "sonner";

// In-memory token storage (Hybrid Session Strategy requirement)
let inMemoryAccessToken: string | null = null;
let isRefreshing = false;
type RetryableRequestConfig = AxiosRequestConfig & { _retry?: boolean };
type QueueEntry = {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
};

let failedQueue: QueueEntry[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const setAccessToken = (token: string | null) => {
  inMemoryAccessToken = token;
};

export const getAccessToken = () => inMemoryAccessToken;

const api = axios.create({
  baseURL: "/api/v1", // Using Vite proxy or standard relative path
  withCredentials: true, // Crucial for Refresh Token (Stateful HttpOnly cookie)
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    if (inMemoryAccessToken) {
      config.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Whitelist of safe error messages that can be displayed to the user
const SAFE_ERROR_MESSAGES = [
  "Invalid email or password",
  "User already exists",
  "Invalid or expired token",
  "Account is locked",
  "Please verify your email",
];

const GENERIC_4XX_MESSAGE = "The request could not be processed. Please check your input.";
const GENERIC_5XX_MESSAGE = "A server error occurred. Please try again later.";

// Response Interceptor: Handle 401 Auto-Refresh & Global Errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    // Handle 401 Unauthorized for Auto-Refresh
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login")
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest._retry = true; // Fix: Prevent infinite retry loop
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${token}`,
            };
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Silently trigger refresh session
        const refreshRes = await axios.post(
          "/api/v1/auth/refresh",
          {},
          { withCredentials: true }
        );

        const { accessToken } = refreshRes.data;
        if (accessToken) {
          setAccessToken(accessToken);
          processQueue(null, accessToken);
          // Retry original request with new token
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${accessToken}`,
          };
          return api(originalRequest);
        } else {
          // Fix: Handle Hanging Queue by treating missing token as an error
          throw new Error("Refresh succeeded but no access token returned");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Refresh failed, clear session
        setAccessToken(null);
        // Dispatch an event so the React application (AuthProvider) can handle the redirect via React Router
        window.dispatchEvent(new Event("auth:unauthorized"));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Global Error Handling & Sanitization (VULN-001)
    if (error.response) {
      const statusCode = error.response.status;
      const apiError = error.response.data || {};
      
      let displayMessage = GENERIC_4XX_MESSAGE;
      let displayTitle = "Error";

      if (statusCode === 429) {
        displayTitle = "Too Many Requests";
        displayMessage = "You've made too many requests. Please wait a moment.";
      } else if (statusCode >= 400 && statusCode < 500) {
        displayTitle = "Request Failed";
        // Check if the backend message is in our safe whitelist
        if (apiError.message && SAFE_ERROR_MESSAGES.includes(apiError.message)) {
          displayMessage = apiError.message;
        }
      } else if (statusCode >= 500) {
        displayTitle = "Server Error";
        displayMessage = GENERIC_5XX_MESSAGE;
      }

      toast.error(displayTitle, {
        description: displayMessage,
      });
    } else {
      toast.error("Network Error", {
        description: "Could not connect to the server. Please check your connection.",
      });
    }

    return Promise.reject(error);
  }
);

export default api;
