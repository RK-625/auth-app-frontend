import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import { toastApiError } from "@/lib/toast-api-error";

// In-memory token storage (Hybrid Session Strategy requirement)
let inMemoryAccessToken: string | null = null;
let isRefreshing = false;
type RetryableRequestConfig = AxiosRequestConfig & { _retry?: boolean };
type QueueEntry = {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
};

let failedQueue: QueueEntry[] = [];

export const AUTH_TOKEN_REFRESHED_EVENT = "auth:token-refreshed";
export type AuthTokenRefreshedEvent = CustomEvent<{ accessToken: string }>;

const dispatchTokenRefreshed = (accessToken: string) => {
  window.dispatchEvent(
    new CustomEvent(AUTH_TOKEN_REFRESHED_EVENT, {
      detail: { accessToken },
    })
  );
};

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

const rawApiBaseUrl = import.meta.env.VITE_API_URL as string | undefined;
const normalizedApiBaseUrl = rawApiBaseUrl?.replace(/\/$/, "");
const apiBaseUrl = import.meta.env.DEV
  ? "/api/v1"
  : normalizedApiBaseUrl
  ? normalizedApiBaseUrl.endsWith("/api/v1")
    ? normalizedApiBaseUrl
    : `${normalizedApiBaseUrl}/api/v1`
  : "/api/v1";

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true, // Crucial for Refresh Token (Stateful HttpOnly cookie)
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
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
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/refresh")
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
          `${apiBaseUrl}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = refreshRes.data;
        if (accessToken) {
          setAccessToken(accessToken);
          dispatchTokenRefreshed(accessToken);
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

    // Skip global toast for 401s as they are either handled above or lead to logout
    if (error.response?.status !== 401) {
      toastApiError(error);
    }

    return Promise.reject(error);
  }
);

export default api;
