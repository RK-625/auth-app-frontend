import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/auth-provider";
import { ReactNode } from "react";

/**
 * PublicRoute component
 * 
 * Inverse of ProtectedRoute. It restricts access to pages that should
 * only be visible to guest users (e.g., Login, Signup, Forget Password).
 * 
 * If the user is authenticated, they are automatically bounced to the dashboard.
 */
export const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Return null or a spinner during the initial session bootstrap
    // to prevent jarring layout shifts or accidental redirects.
    return null; 
  }

  if (isAuthenticated) {
    // If the user is logged in, redirect them to the dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // If not logged in, allow them to view the guest page
  return <>{children}</>;
};
