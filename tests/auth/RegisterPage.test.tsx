import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { AuthProvider } from '@/context/AuthContext';
import * as authService from '@/services/authService';

vi.mock('@/services/authService', async () => {
  const actual = await vi.importActual<typeof import('@/services/authService')>('@/services/authService');
  return {
    ...actual,
    registerUser: vi.fn(),
  };
});

const renderRegisterPage = () => {
  return render(
    <AuthProvider>
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    </AuthProvider>
  );
};

describe('RegisterPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders role selector buttons and general form fields', () => {
    renderRegisterPage();

    expect(screen.getByRole('heading', { name: /create your foodbridge account/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /food donor/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ngo officer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /volunteer/i })).toBeInTheDocument();

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();

    // NGO specific fields are not shown by default for donor
    expect(screen.queryByLabelText(/legal organization name/i)).not.toBeInTheDocument();
  });

  it('reveals organization credential fields when NGO Officer role is selected', async () => {
    const user = userEvent.setup();
    renderRegisterPage();

    const ngoTab = screen.getByRole('button', { name: /ngo officer/i });
    await user.click(ngoTab);

    expect(screen.getByLabelText(/legal organization name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/registration \/ tax id number/i)).toBeInTheDocument();
    expect(screen.getByText(/ngo applications undergo verification by platform administrators/i)).toBeInTheDocument();
  });

  it('validates password mismatch and prevents submission', async () => {
    const user = userEvent.setup();
    renderRegisterPage();

    await user.type(screen.getByLabelText(/full name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/email address/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/phone number/i), '+919876543210');
    await user.type(screen.getByLabelText(/^password/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'differentPassword');

    await user.click(screen.getByRole('button', { name: /complete registration/i }));

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    expect(authService.registerUser).not.toHaveBeenCalled();
  });

  it('calls registerUser with selected role and parameters when form is valid', async () => {
    vi.mocked(authService.registerUser).mockResolvedValueOnce({
      user: { uid: 'u-123' } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      profile: {
        uid: 'u-123',
        email: 'jane@example.com',
        fullName: 'Jane Doe',
        phone: '+919876543210',
        role: 'donor',
        accountStatus: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });

    const user = userEvent.setup();
    renderRegisterPage();

    await user.type(screen.getByLabelText(/full name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/email address/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/phone number/i), '+919876543210');
    await user.type(screen.getByLabelText(/^password/i), 'validPassword123');
    await user.type(screen.getByLabelText(/confirm password/i), 'validPassword123');

    await user.click(screen.getByRole('button', { name: /complete registration/i }));

    expect(authService.registerUser).toHaveBeenCalledWith({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      phone: '+919876543210',
      password: 'validPassword123',
      role: 'donor',
      organizationName: undefined,
      registrationNumber: undefined,
      officialAddress: undefined,
    });
  });
});
