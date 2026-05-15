import { useState, useEffect, useMemo, useCallback } from "react";
import type { ReactNode } from "react";
import api, {
  AUTH_TOKEN_REFRESHED_EVENT,
  setAccessToken as setApiAccessToken,
  type AuthTokenRefreshedEvent,
} from "@/lib/api";
import { toastApiError } from "@/lib/toast-api-error";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/components/auth-context";
import type { User } from "@/components/auth-context";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    // On mount, try to fetch the current session/user
    // If the refresh cookie is present, this will trigger the auto-refresh interceptor
    const bootstrap = async () => {
       const hasSessionHint = document.cookie.includes("logged_in=true");
       
       if (!hasSessionHint) {
         // No hint found? User is definitely logged out. 
         // Do not call the backend. Just stop loading.
         if (isMounted) setIsLoading(false);
         return;
       }

       // Hint found! We know for a fact the browser has a refresh token.
       // Safe to call the /refresh API now.
       try {
          const res = await api.post("/auth/refresh");
          if (res.data && res.data.accessToken) {
             setApiAccessToken(res.data.accessToken);
             setAccessToken(res.data.accessToken);
             if (res.data.user && isMounted) {
                setUser(res.data.user);
             }
          }
       } catch {
          // Silent failure on bootstrap if refresh token is invalid/expired
          if (isMounted) {
            setApiAccessToken(null);
            setAccessToken(null);
            setUser(null);
          }
       } finally {
          if (isMounted) setIsLoading(false);
       }
    };
    bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  // Listen for unauthorized events dispatched by the API interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      setApiAccessToken(null);
      setAccessToken(null);
      setUser(null);
      navigate("/login", { replace: true });
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [navigate]);

  useEffect(() => {
    const handleTokenRefreshed = (event: Event) => {
      const { accessToken: refreshedToken } = (event as AuthTokenRefreshedEvent).detail;
      setAccessToken(refreshedToken);
    };

    window.addEventListener(AUTH_TOKEN_REFRESHED_EVENT, handleTokenRefreshed);
    return () => window.removeEventListener(AUTH_TOKEN_REFRESHED_EVENT, handleTokenRefreshed);
  }, []);

  const setSession = useCallback((token: string, userData: User) => {
    setApiAccessToken(token);
    setAccessToken(token);
    setUser(userData);
  }, []);

  const clearSession = useCallback(() => {
    setApiAccessToken(null);
    setAccessToken(null);
    setUser(null);
  }, []);

  const logout = useCallback(async (redirectTo: string = "/login") => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      toastApiError(error)
    } finally {
      clearSession();
      navigate(redirectTo, { replace: true });
    }
  }, [clearSession, navigate]);

  const contextValue = useMemo(() => ({
    user,
    accessToken,
    isLoaded: !isLoading,
    isSignedIn: !!user,
    isAuthenticated: !!user,
    isLoading,
    setSession,
    clearSession,
    login: setSession,
    logout
  }), [user, accessToken, isLoading, setSession, clearSession, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
