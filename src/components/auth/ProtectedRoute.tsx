import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';
import { LoadingState } from '@/components/ui/FeedbackStates';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  allowPendingNgo?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  allowPendingNgo = false,
}) => {
  const { user, profile, loading, isSuspended, isPendingNgo } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingState message="Verifying session and permissions..." fullPage />;
  }

  // 1. Not signed in -> Redirect to login, preserving intended return route
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Account suspended -> Redirect to suspension notice
  if (isSuspended && location.pathname !== '/account-suspended') {
    return <Navigate to="/account-suspended" replace />;
  }

  // 3. NGO Officer with pending application
  if (isPendingNgo && !allowPendingNgo && location.pathname !== '/ngo/application-status') {
    return <Navigate to="/ngo/application-status" replace />;
  }

  // 4. Role mismatch check
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    // If user has a valid profile, redirect them to their own authorized dashboard
    switch (profile.role) {
      case 'donor':
        return <Navigate to="/donor/dashboard" replace />;
      case 'volunteer':
        return <Navigate to="/volunteer/dashboard" replace />;
      case 'ngo':
        return isPendingNgo ? (
          <Navigate to="/ngo/application-status" replace />
        ) : (
          <Navigate to="/ngo/dashboard" replace />
        );
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};
