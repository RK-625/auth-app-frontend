import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/auth-context";
import type { ReactNode } from "react";
import { AuthLoadingScreen } from "@/components/auth-loading-screen";

/**
 * PublicRoute component
 * 
 * Inverse of ProtectedRoute. It restricts access to pages that should
 * only be visible to guest users (e.g., Login, Signup, Forget Password).
 * 
 * If the user is authenticated, they are automatically bounced to the dashboard.
 */
export const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoaded } = useAuth();

  if (!isLoaded) {
    return <AuthLoadingScreen />;
  }

  if (isAuthenticated) {
    // If the user is logged in, redirect them to the dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // If not logged in, allow them to view the guest page
  return <>{children}</>;
};
