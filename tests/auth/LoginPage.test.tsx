import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from '@/pages/auth/LoginPage';
import { AuthProvider } from '@/context/AuthContext';
import * as authService from '@/services/authService';

vi.mock('@/services/authService', async () => {
  const actual = await vi.importActual<typeof import('@/services/authService')>('@/services/authService');
  return {
    ...actual,
    loginUser: vi.fn(),
  };
});

const renderLoginPage = () => {
  return render(
    <AuthProvider>
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    </AuthProvider>
  );
};

describe('LoginPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form with inputs and sign in action', () => {
    renderLoginPage();

    expect(screen.getByRole('heading', { name: /sign in to foodbridge/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation error when submitting empty fields', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    const submitBtn = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitBtn);

    expect(
      screen.getByText(/please enter both your email and password/i)
    ).toBeInTheDocument();
    expect(authService.loginUser).not.toHaveBeenCalled();
  });

  it('displays user-friendly error message when Firebase login fails', async () => {
    vi.mocked(authService.loginUser).mockRejectedValueOnce({
      code: 'auth/invalid-credential',
    });

    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText(/email address/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongPassword');

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(
      await screen.findByText(/invalid email or password. please verify your credentials/i)
    ).toBeInTheDocument();
  });
});
