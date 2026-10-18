import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserPlus,
  PackageCheck,
  Building2,
  Users,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { registerUser, formatAuthError } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { FirebaseConfigNotice } from '@/components/auth/FirebaseConfigNotice';

type PublicRegistrationRole = 'donor' | 'volunteer' | 'ngo';

export const RegisterPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<PublicRegistrationRole>('donor');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // NGO-specific state
  const [organizationName, setOrganizationName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [officialAddress, setOfficialAddress] = useState('');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { refreshProfile } = useAuth();

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!fullName.trim()) {
      errors.fullName = 'Full name is required.';
    }

    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!phone.trim()) {
      errors.phone = 'Phone number is required for coordination.';
    } else if (phone.trim().length < 8) {
      errors.phone = 'Please provide a valid phone number with area/country code.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (selectedRole === 'ngo') {
      if (!organizationName.trim()) {
        errors.organizationName = 'Organization legal name is required.';
      }
      if (!registrationNumber.trim()) {
        errors.registrationNumber = 'Government registration or tax ID number is required.';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { profile } = await registerUser({
        fullName,
        email,
        phone,
        password,
        role: selectedRole,
        organizationName: selectedRole === 'ngo' ? organizationName : undefined,
        registrationNumber: selectedRole === 'ngo' ? registrationNumber : undefined,
        officialAddress: selectedRole === 'ngo' ? officialAddress : undefined,
      });

      await refreshProfile();

      if (profile.role === 'ngo') {
        // Pending approval redirect
        navigate('/ngo/application-status', { replace: true });
      } else if (profile.role === 'volunteer') {
        navigate('/volunteer/dashboard', { replace: true });
      } else {
        navigate('/donor/dashboard', { replace: true });
      }
    } catch (err) {
      setGeneralError(formatAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-border-subtle rounded-2xl p-6 sm:p-10 shadow-card space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-sage flex items-center justify-center text-forest mx-auto">
              <UserPlus className="w-6 h-6" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-main tracking-tight">
              Create your FoodBridge Account
            </h1>
            <p className="text-sm text-muted">
              Select your participation role and register to start coordinating food rescue.
            </p>
          </div>

          <FirebaseConfigNotice />

          {generalError && (
            <div
              role="alert"
              className="p-3.5 rounded-lg bg-[#FEF2F2] border border-status-error/30 text-xs sm:text-sm text-status-error font-medium"
            >
              {generalError}
            </div>
          )}

          {/* Role Selector Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted block">
              Select Your Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('donor')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest ${
                  selectedRole === 'donor'
                    ? 'border-forest bg-sage/50 text-forest shadow-subtle'
                    : 'border-border-subtle bg-white text-muted hover:border-forest/40'
                }`}
              >
                <PackageCheck className="w-5 h-5" aria-hidden="true" />
                <span className="text-xs font-semibold">Food Donor</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('ngo')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest ${
                  selectedRole === 'ngo'
                    ? 'border-forest bg-sage/50 text-forest shadow-subtle'
                    : 'border-border-subtle bg-white text-muted hover:border-forest/40'
                }`}
              >
                <Building2 className="w-5 h-5" aria-hidden="true" />
                <span className="text-xs font-semibold">NGO Officer</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('volunteer')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest ${
                  selectedRole === 'volunteer'
                    ? 'border-forest bg-sage/50 text-forest shadow-subtle'
                    : 'border-border-subtle bg-white text-muted hover:border-forest/40'
                }`}
              >
                <Users className="w-5 h-5" aria-hidden="true" />
                <span className="text-xs font-semibold">Volunteer</span>
              </button>
            </div>

            {selectedRole === 'ngo' && (
              <p className="text-xs text-[#946200] bg-[#FEF7EC] border border-[#F8DCA6] p-2.5 rounded-lg mt-2">
                <strong>Important Note:</strong> NGO applications undergo verification by platform administrators before donation coordination tools are unlocked.
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <FormField
              id="reg-fullName"
              label="Full Name"
              required
              error={fieldErrors.fullName}
            >
              {(props) => (
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  autoComplete="name"
                  required
                  className="w-full px-3.5 py-2 rounded-lg border border-border-subtle bg-white text-main text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
                  {...props}
                />
              )}
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                id="reg-email"
                label="Email Address"
                required
                error={fieldErrors.email}
              >
                {(props) => (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                    required
                    className="w-full px-3.5 py-2 rounded-lg border border-border-subtle bg-white text-main text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
                    {...props}
                  />
                )}
              </FormField>

              <FormField
                id="reg-phone"
                label="Phone Number"
                required
                error={fieldErrors.phone}
                helpText="For pickup/delivery calls"
              >
                {(props) => (
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                    required
                    className="w-full px-3.5 py-2 rounded-lg border border-border-subtle bg-white text-main text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
                    {...props}
                  />
                )}
              </FormField>
            </div>

            {/* NGO Specific Fields */}
            {selectedRole === 'ngo' && (
              <div className="p-4 rounded-xl bg-sage-light border border-border-subtle space-y-4">
                <span className="text-xs font-semibold text-forest uppercase tracking-wider block">
                  Organization Credential Details
                </span>

                <FormField
                  id="reg-orgName"
                  label="Legal Organization Name"
                  required
                  error={fieldErrors.organizationName}
                >
                  {(props) => (
                    <input
                      type="text"
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      placeholder="e.g. Hope Community Kitchen"
                      required
                      className="w-full px-3.5 py-2 rounded-lg border border-border-subtle bg-white text-main text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
                      {...props}
                    />
                  )}
                </FormField>

                <FormField
                  id="reg-regNumber"
                  label="Registration / Tax ID Number"
                  required
                  error={fieldErrors.registrationNumber}
                  helpText="Government registration certificate number"
                >
                  {(props) => (
                    <input
                      type="text"
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      placeholder="e.g. REG-2024-89012"
                      required
                      className="w-full px-3.5 py-2 rounded-lg border border-border-subtle bg-white text-main text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
                      {...props}
                    />
                  )}
                </FormField>

                <FormField
                  id="reg-address"
                  label="Registered Headquarters Address"
                  helpText="Primary facility or kitchen location"
                >
                  {(props) => (
                    <input
                      type="text"
                      value={officialAddress}
                      onChange={(e) => setOfficialAddress(e.target.value)}
                      placeholder="Street, City, Postal Code"
                      className="w-full px-3.5 py-2 rounded-lg border border-border-subtle bg-white text-main text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
                      {...props}
                    />
                  )}
                </FormField>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                id="reg-password"
                label="Password"
                required
                error={fieldErrors.password}
                helpText="Min. 6 characters"
              >
                {(props) => (
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    className="w-full px-3.5 py-2 rounded-lg border border-border-subtle bg-white text-main text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
                    {...props}
                  />
                )}
              </FormField>

              <FormField
                id="reg-confirmPassword"
                label="Confirm Password"
                required
                error={fieldErrors.confirmPassword}
              >
                {(props) => (
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    className="w-full px-3.5 py-2 rounded-lg border border-border-subtle bg-white text-main text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
                    {...props}
                  />
                )}
              </FormField>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full mt-2"
              rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
            >
              Complete Registration
            </Button>
          </form>

          {/* Admin notice */}
          <div className="p-3.5 rounded-lg bg-[#FEF2F2] border border-status-error/30 text-xs text-status-error flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              <strong>Admin Restriction:</strong> Administrator privileges cannot be registered here. Admin accounts are provisioned exclusively through authorized server-side operations.
            </span>
          </div>

          <div className="pt-4 border-t border-border-subtle text-center text-xs sm:text-sm text-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-forest hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
