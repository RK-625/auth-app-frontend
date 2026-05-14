import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import api, { setAccessToken as setApiAccessToken } from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  roles: { name: string }[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, user: User) => void;
  logout: (redirectTo?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
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
             if (res.data.user && isMounted) {
                setUser(res.data.user);
             }
          }
       } catch (e) {
          // Silent failure on bootstrap if refresh token is invalid/expired
          if (isMounted) {
            setApiAccessToken(null);
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
      setUser(null);
      navigate("/login", { replace: true });
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [navigate]);

  const login = useCallback((accessToken: string, userData: User) => {
    setApiAccessToken(accessToken);
    setUser(userData);
  }, []);

  const logout = useCallback(async (redirectTo: string = "/login") => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      setApiAccessToken(null);
      setUser(null);
      navigate(redirectTo, { replace: true });
    }
  }, [navigate]);

  const contextValue = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  }), [user, isLoading, login, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
