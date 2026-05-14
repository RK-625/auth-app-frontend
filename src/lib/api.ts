import axios from "axios";
import { toast } from "sonner";

// In-memory token storage (Hybrid Session Strategy requirement)
let inMemoryAccessToken: string | null = null;
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
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

// Response Interceptor: Handle 401 Auto-Refresh & Global Errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized for Auto-Refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login")
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest._retry = true; // Fix: Prevent infinite retry loop
            originalRequest.headers.Authorization = `Bearer ${token}`;
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
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
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

    // Global Error Handling
    if (error.response && error.response.data) {
      const apiError = error.response.data;
      if (apiError.message) {
        // Map message to toast notification
        if (error.response.status === 429) {
           toast.error("Too Many Requests", {
              description: apiError.message,
           });
        } else {
           toast.error(apiError.error || "Error", {
              description: apiError.message,
           });
        }
      }
    } else {
      toast.error("Network Error", {
        description: "Could not connect to the server.",
      });
    }

    return Promise.reject(error);
  }
);

export default api;
