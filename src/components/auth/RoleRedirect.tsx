import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LoadingState } from '@/components/ui/FeedbackStates';

/**
 * Handles role-based redirection to the appropriate destination based on profile and account status.
 */
export const RoleRedirect: React.FC = () => {
  const { user, profile, loading, isSuspended, isPendingNgo } = useAuth();

  if (loading) {
    return <LoadingState message="Redirecting to your authorized dashboard..." fullPage />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isSuspended) {
    return <Navigate to="/account-suspended" replace />;
  }

  if (isPendingNgo) {
    return <Navigate to="/ngo/application-status" replace />;
  }

  switch (profile?.role) {
    case 'donor':
      return <Navigate to="/donor/dashboard" replace />;
    case 'volunteer':
      return <Navigate to="/volunteer/dashboard" replace />;
    case 'ngo':
      return <Navigate to="/ngo/dashboard" replace />;
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    default:
      // If profile is still resolving or not found, fallback to home
      return <Navigate to="/" replace />;
  }
};
