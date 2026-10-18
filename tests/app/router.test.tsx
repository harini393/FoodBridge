import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { HomePage } from '@/pages/public/HomePage';
import { AboutPage } from '@/pages/public/AboutPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { PrivacyTermsPage } from '@/pages/public/PrivacyTermsPage';
import { NotFoundPage } from '@/pages/public/NotFoundPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleRedirect } from '@/components/auth/RoleRedirect';

const createTestRouter = (initialPath = '/') => {
  return createMemoryRouter(
    [
      {
        path: '/',
        element: <PublicLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'about', element: <AboutPage /> },
          { path: 'login', element: <LoginPage /> },
          { path: 'register', element: <RegisterPage /> },
          { path: 'privacy-terms', element: <PrivacyTermsPage /> },
          {
            path: 'dashboard',
            element: (
              <ProtectedRoute>
                <RoleRedirect />
              </ProtectedRoute>
            ),
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
    { initialEntries: [initialPath] }
  );
};

const renderWithAuth = (router: ReturnType<typeof createTestRouter>) => {
  return render(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

describe('Router Integration', () => {
  it('renders HomePage at root route "/"', () => {
    const router = createTestRouter('/');
    renderWithAuth(router);
    expect(
      screen.getByRole('heading', { name: /bridging surplus food to communities in need/i, level: 1 })
    ).toBeInTheDocument();
  });

  it('renders AboutPage at "/about"', () => {
    const router = createTestRouter('/about');
    renderWithAuth(router);
    expect(
      screen.getByRole('heading', { name: /about foodbridge/i, level: 1 })
    ).toBeInTheDocument();
  });

  it('renders interactive LoginPage at "/login"', () => {
    const router = createTestRouter('/login');
    renderWithAuth(router);
    expect(
      screen.getByRole('heading', { name: /sign in to foodbridge/i, level: 1 })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders interactive RegisterPage at "/register"', () => {
    const router = createTestRouter('/register');
    renderWithAuth(router);
    expect(
      screen.getByRole('heading', { name: /create your foodbridge account/i, level: 1 })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /food donor/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ngo officer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /volunteer/i })).toBeInTheDocument();
  });

  it('redirects unauthenticated users attempting to access /dashboard to /login', async () => {
    const router = createTestRouter('/dashboard');
    renderWithAuth(router);
    expect(
      await screen.findByRole('heading', { name: /sign in to foodbridge/i, level: 1 })
    ).toBeInTheDocument();
  });

  it('renders PrivacyTermsPage at "/privacy-terms"', () => {
    const router = createTestRouter('/privacy-terms');
    renderWithAuth(router);
    expect(
      screen.getByRole('heading', { name: /privacy policy & terms of coordination/i, level: 1 })
    ).toBeInTheDocument();
  });

  it('renders NotFoundPage at unknown route "/unknown-page"', () => {
    const router = createTestRouter('/unknown-page');
    renderWithAuth(router);
    expect(
      screen.getByRole('heading', { name: /page not found/i, level: 1 })
    ).toBeInTheDocument();
  });
});
