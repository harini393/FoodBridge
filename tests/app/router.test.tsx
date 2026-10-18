import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { HomePage } from '@/pages/public/HomePage';
import { AboutPage } from '@/pages/public/AboutPage';
import { LoginPage, RegisterPage } from '@/pages/public/AuthInfoPages';
import { PrivacyTermsPage } from '@/pages/public/PrivacyTermsPage';
import { NotFoundPage } from '@/pages/public/NotFoundPage';

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
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
    { initialEntries: [initialPath] }
  );
};

describe('Router Integration', () => {
  it('renders HomePage at root route "/"', () => {
    const router = createTestRouter('/');
    render(<RouterProvider router={router} />);
    expect(
      screen.getByRole('heading', { name: /bridging surplus food to communities in need/i, level: 1 })
    ).toBeInTheDocument();
  });

  it('renders AboutPage at "/about"', () => {
    const router = createTestRouter('/about');
    render(<RouterProvider router={router} />);
    expect(
      screen.getByRole('heading', { name: /about foodbridge/i, level: 1 })
    ).toBeInTheDocument();
  });

  it('renders LoginPage with Phase 1 truthful notice at "/login"', () => {
    const router = createTestRouter('/login');
    render(<RouterProvider router={router} />);
    expect(
      screen.getByRole('heading', { name: /sign in to foodbridge/i, level: 1 })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/firebase authentication, session management, and role-based redirects are implemented in/i)
    ).toBeInTheDocument();
  });

  it('renders RegisterPage at "/register"', () => {
    const router = createTestRouter('/register');
    render(<RouterProvider router={router} />);
    expect(
      screen.getByRole('heading', { name: /get started with foodbridge/i, level: 1 })
    ).toBeInTheDocument();
  });

  it('renders PrivacyTermsPage at "/privacy-terms"', () => {
    const router = createTestRouter('/privacy-terms');
    render(<RouterProvider router={router} />);
    expect(
      screen.getByRole('heading', { name: /privacy policy & terms of coordination/i, level: 1 })
    ).toBeInTheDocument();
  });

  it('renders NotFoundPage at unknown route "/unknown-page"', () => {
    const router = createTestRouter('/unknown-page');
    render(<RouterProvider router={router} />);
    expect(
      screen.getByRole('heading', { name: /page not found/i, level: 1 })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /return to homepage/i })
    ).toBeInTheDocument();
  });
});
