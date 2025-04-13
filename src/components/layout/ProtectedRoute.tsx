
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireOnboarding?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
  requireOnboarding = true,
}) => {
  const { isAuthenticated, isAdmin, isOnboarded, isLoading } = useAuth();
  const location = useLocation();

  // If we're already on the onboarding page, don't check onboarding requirement
  const isOnboardingPage = location.pathname === "/onboarding";

  useEffect(() => {
    // Debug information
    console.log({
      isAuthenticated,
      isAdmin,
      isOnboarded,
      isLoading,
      isOnboardingPage,
      path: location.pathname,
      requireOnboarding
    });
  }, [isAuthenticated, isAdmin, isOnboarded, isLoading, isOnboardingPage, location.pathname, requireOnboarding]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Skip onboarding check if we're already on the onboarding page or user is admin
  if (requireOnboarding && !isOnboarded && !isAdmin && !isOnboardingPage) {
    console.log("Redirecting to onboarding from:", location.pathname);
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
