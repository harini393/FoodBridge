import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { User } from 'firebase/auth';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import * as AuthContextModule from '@/context/AuthContext';
import { UserProfile } from '@/types/auth';

const mockUseAuth = vi.spyOn(AuthContextModule, 'useAuth');

describe('ProtectedRoute Component', () => {
  it('renders loading state when authentication is resolving', () => {
    mockUseAuth.mockReturnValue({
      loading: true,
      user: null,
      profile: null,
      isSuspended: false,
      isPendingNgo: false,
    } as unknown as AuthContextModule.AuthContextType);

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Secret Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('Secret Content')).not.toBeInTheDocument();
  });

  it('redirects unauthenticated visitor to /login', () => {
    mockUseAuth.mockReturnValue({
      loading: false,
      user: null,
      profile: null,
      isSuspended: false,
      isPendingNgo: false,
    } as unknown as AuthContextModule.AuthContextType);

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Secret Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page Mock</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page Mock')).toBeInTheDocument();
    expect(screen.queryByText('Secret Content')).not.toBeInTheDocument();
  });

  it('redirects suspended account to /account-suspended', () => {
    mockUseAuth.mockReturnValue({
      loading: false,
      user: { uid: 'u1' } as unknown as User,
      profile: { uid: 'u1', role: 'donor', accountStatus: 'suspended' } as UserProfile,
      isSuspended: true,
      isPendingNgo: false,
    } as unknown as AuthContextModule.AuthContextType);

    render(
      <MemoryRouter initialEntries={['/donor/dashboard']}>
        <Routes>
          <Route
            path="/donor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['donor']}>
                <div>Donor Dashboard</div>
              </ProtectedRoute>
            }
          />
          <Route path="/account-suspended" element={<div>Suspension Notice Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Suspension Notice Page')).toBeInTheDocument();
    expect(screen.queryByText('Donor Dashboard')).not.toBeInTheDocument();
  });

  it('redirects pending NGO officer to /ngo/application-status when accessing protected coordination routes', () => {
    mockUseAuth.mockReturnValue({
      loading: false,
      user: { uid: 'ngo1' } as unknown as User,
      profile: { uid: 'ngo1', role: 'ngo', accountStatus: 'pending' } as UserProfile,
      isSuspended: false,
      isPendingNgo: true,
    } as unknown as AuthContextModule.AuthContextType);

    render(
      <MemoryRouter initialEntries={['/ngo/dashboard']}>
        <Routes>
          <Route
            path="/ngo/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ngo']}>
                <div>NGO Full Coordination Dashboard</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ngo/application-status"
            element={<div>NGO Application Pending Screen</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('NGO Application Pending Screen')).toBeInTheDocument();
    expect(screen.queryByText('NGO Full Coordination Dashboard')).not.toBeInTheDocument();
  });

  it('permits authorized user with matching role to access children', () => {
    mockUseAuth.mockReturnValue({
      loading: false,
      user: { uid: 'donor1' } as unknown as User,
      profile: { uid: 'donor1', role: 'donor', accountStatus: 'active' } as UserProfile,
      isSuspended: false,
      isPendingNgo: false,
    } as unknown as AuthContextModule.AuthContextType);

    render(
      <MemoryRouter initialEntries={['/donor/dashboard']}>
        <Routes>
          <Route
            path="/donor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['donor']}>
                <div>Donor Protected Portal Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Donor Protected Portal Content')).toBeInTheDocument();
  });
});
