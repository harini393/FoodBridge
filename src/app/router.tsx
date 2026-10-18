import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { HomePage } from '@/pages/public/HomePage';
import { AboutPage } from '@/pages/public/AboutPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { SuspendedAccountPage } from '@/pages/auth/SuspendedAccountPage';
import { PrivacyTermsPage } from '@/pages/public/PrivacyTermsPage';
import { NotFoundPage } from '@/pages/public/NotFoundPage';

// Protected Route and Role Redirect
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleRedirect } from '@/components/auth/RoleRedirect';

// Status & Dashboard Placeholders
import { NgoApplicationStatusPage } from '@/pages/ngo/NgoApplicationStatusPage';
import { DonorDashboardPlaceholder } from '@/pages/donor/DonorDashboardPlaceholder';
import { VolunteerDashboardPlaceholder } from '@/pages/volunteer/VolunteerDashboardPlaceholder';
import { NgoDashboardPlaceholder } from '@/pages/ngo/NgoDashboardPlaceholder';
import { AdminDashboardPlaceholder } from '@/pages/admin/AdminDashboardPlaceholder';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'privacy-terms',
        element: <PrivacyTermsPage />,
      },
      {
        path: 'account-suspended',
        element: <SuspendedAccountPage />,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <RoleRedirect />
          </ProtectedRoute>
        ),
      },
      {
        path: 'donor/dashboard',
        element: (
          <ProtectedRoute allowedRoles={['donor']}>
            <DonorDashboardPlaceholder />
          </ProtectedRoute>
        ),
      },
      {
        path: 'volunteer/dashboard',
        element: (
          <ProtectedRoute allowedRoles={['volunteer']}>
            <VolunteerDashboardPlaceholder />
          </ProtectedRoute>
        ),
      },
      {
        path: 'ngo/dashboard',
        element: (
          <ProtectedRoute allowedRoles={['ngo']}>
            <NgoDashboardPlaceholder />
          </ProtectedRoute>
        ),
      },
      {
        path: 'ngo/application-status',
        element: (
          <ProtectedRoute allowedRoles={['ngo']} allowPendingNgo>
            <NgoApplicationStatusPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/dashboard',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboardPlaceholder />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
