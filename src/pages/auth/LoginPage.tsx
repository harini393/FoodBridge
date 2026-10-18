import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { loginUser, formatAuthError } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { FirebaseConfigNotice } from '@/components/auth/FirebaseConfigNotice';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { refreshProfile } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email.trim() || !password) {
      setFormError('Please enter both your email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { profile } = await loginUser(email, password);
      await refreshProfile();

      // Check for return path passed in state (e.g. from ProtectedRoute)
      const fromPath = (location.state as { from?: { pathname: string } })?.from?.pathname;
      if (fromPath && fromPath !== '/login' && fromPath !== '/account-suspended') {
        navigate(fromPath, { replace: true });
        return;
      }

      // Default role-aware redirects
      if (!profile) {
        navigate('/');
        return;
      }

      if (profile.accountStatus === 'suspended') {
        navigate('/account-suspended', { replace: true });
        return;
      }

      switch (profile.role) {
        case 'donor':
          navigate('/donor/dashboard', { replace: true });
          break;
        case 'volunteer':
          navigate('/volunteer/dashboard', { replace: true });
          break;
        case 'ngo':
          if (profile.accountStatus === 'pending') {
            navigate('/ngo/application-status', { replace: true });
          } else {
            navigate('/ngo/dashboard', { replace: true });
          }
          break;
        case 'admin':
          navigate('/admin/dashboard', { replace: true });
          break;
        default:
          navigate('/', { replace: true });
      }
    } catch (err) {
      setFormError(formatAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <div className="bg-white border border-border-subtle rounded-2xl p-6 sm:p-10 shadow-card space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-sage flex items-center justify-center text-forest mx-auto">
              <Lock className="w-6 h-6" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-main tracking-tight">
              Sign In to FoodBridge
            </h1>
            <p className="text-sm text-muted">
              Access your donation, NGO, or volunteer coordination dashboard.
            </p>
          </div>

          <FirebaseConfigNotice />

          {formError && (
            <div
              role="alert"
              className="p-3.5 rounded-lg bg-[#FEF2F2] border border-status-error/30 text-xs sm:text-sm text-status-error font-medium"
            >
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <FormField id="login-email" label="Email Address" required>
              {(props) => (
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@organization.org"
                    autoComplete="email"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border-subtle bg-white text-main text-sm placeholder:text-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
                    {...props}
                  />
                  <Mail
                    className="w-4 h-4 text-muted absolute right-3 top-3 pointer-events-none"
                    aria-hidden="true"
                  />
                </div>
              )}
            </FormField>

            <FormField id="login-password" label="Password" required>
              {(props) => (
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border-subtle bg-white text-main text-sm placeholder:text-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
                    {...props}
                  />
                  <Lock
                    className="w-4 h-4 text-muted absolute right-3 top-3 pointer-events-none"
                    aria-hidden="true"
                  />
                </div>
              )}
            </FormField>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full mt-2"
              rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
            >
              Sign In
            </Button>
          </form>

          {/* Role guidance */}
          <div className="p-3.5 rounded-lg bg-cream border border-border-subtle text-xs text-muted flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-forest shrink-0" aria-hidden="true" />
            <span>
              Administrator accounts are owner-provisioned and cannot register publicly.
            </span>
          </div>

          <div className="pt-4 border-t border-border-subtle text-center text-xs sm:text-sm text-muted">
            Don&apos;t have an account yet?{' '}
            <Link to="/register" className="font-semibold text-forest hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
