import React from 'react';
import { Link } from 'react-router-dom';
import {
  Lock,
  UserPlus,
  ArrowLeft,
  Building2,
  PackageCheck,
  Users,
  ShieldAlert,
  Info,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-border-subtle rounded-2xl p-6 sm:p-10 shadow-card space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-sage flex items-center justify-center text-forest mx-auto">
              <Lock className="w-6 h-6" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-main">
              Sign In to FoodBridge
            </h1>
            <p className="text-sm text-muted">
              Secure, role-based access for Donors, NGOs, Volunteers, and Admins.
            </p>
          </div>

          {/* Phase 1 truthful notice */}
          <div className="p-4 rounded-xl bg-cream border border-border-subtle flex items-start gap-3">
            <Info className="w-5 h-5 text-forest shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-xs sm:text-sm text-muted space-y-1">
              <strong className="text-main font-semibold">Phase 1 Implementation Notice:</strong>
              <p>
                Firebase Authentication, session management, and role-based redirects are implemented in <strong>Phase 2</strong>. In accordance with strict project rules, fake credentials or mock logins are not simulated.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
              Upcoming Authentication Roles
            </h2>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="p-3 rounded-lg border border-border-subtle bg-sage-light flex items-center gap-3">
                <PackageCheck className="w-4 h-4 text-forest shrink-0" aria-hidden="true" />
                <div>
                  <div className="font-semibold text-main text-xs sm:text-sm">Food Donors</div>
                  <div className="text-xs text-muted">Access donation history and submit surplus food</div>
                </div>
              </div>
              <div className="p-3 rounded-lg border border-border-subtle bg-sage-light flex items-center gap-3">
                <Building2 className="w-4 h-4 text-forest shrink-0" aria-hidden="true" />
                <div>
                  <div className="font-semibold text-main text-xs sm:text-sm">Verified NGO Officers</div>
                  <div className="text-xs text-muted">Review donations and coordinate distribution (post-approval)</div>
                </div>
              </div>
              <div className="p-3 rounded-lg border border-border-subtle bg-sage-light flex items-center gap-3">
                <Users className="w-4 h-4 text-forest shrink-0" aria-hidden="true" />
                <div>
                  <div className="font-semibold text-main text-xs sm:text-sm">Volunteer Couriers</div>
                  <div className="text-xs text-muted">Manage assigned pickup and delivery tasks</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
            <Link
              to="/"
              className="text-xs sm:text-sm font-medium text-forest hover:text-forest-hover flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Back to Homepage</span>
            </Link>
            <Link
              to="/register"
              className="text-xs sm:text-sm font-semibold text-forest hover:underline"
            >
              View Registration Info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-border-subtle rounded-2xl p-6 sm:p-10 shadow-card space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-sage flex items-center justify-center text-forest mx-auto">
              <UserPlus className="w-6 h-6" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-main">
              Get Started with FoodBridge
            </h1>
            <p className="text-sm text-muted">
              Choose your role in the food donation and distribution network.
            </p>
          </div>

          {/* Phase 1 truthful notice */}
          <div className="p-4 rounded-xl bg-cream border border-border-subtle flex items-start gap-3">
            <Info className="w-5 h-5 text-forest shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-xs sm:text-sm text-muted space-y-1">
              <strong className="text-main font-semibold">Phase 1 Implementation Notice:</strong>
              <p>
                Account creation forms and Firestore user profile schema will be active in <strong>Phase 2</strong>. Below are the registration requirements for each participant role.
              </p>
            </div>
          </div>

          {/* Role Requirements Overview */}
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-xl border border-border-subtle bg-white hover:border-forest/40 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <PackageCheck className="w-5 h-5 text-forest" aria-hidden="true" />
                <h2 className="font-heading font-bold text-main text-base">
                  1. Food Donor Account
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Open to restaurants, caterers, bakers, cafeterias, and individuals. Requires email, phone number, and primary location. Donors can submit food donations immediately after email verification.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border-subtle bg-white hover:border-forest/40 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-5 h-5 text-forest" aria-hidden="true" />
                <h2 className="font-heading font-bold text-main text-base">
                  2. NGO Officer Application
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Requires organization name, government registration number, primary contact details, and document references. Coordination features remain locked until an Administrator approves the application.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border-subtle bg-white hover:border-forest/40 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-forest" aria-hidden="true" />
                <h2 className="font-heading font-bold text-main text-base">
                  3. Volunteer Courier
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Open to individuals with personal transit capability. Requires contact info and active availability. Volunteers receive and accept delivery tasks coordinated by local NGOs.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-status-error/30 bg-[#FEF2F2]/50">
              <div className="flex items-center gap-3 mb-1">
                <ShieldAlert className="w-5 h-5 text-status-error" aria-hidden="true" />
                <h2 className="font-heading font-bold text-main text-sm">
                  Administrator Access Policy
                </h2>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Admin accounts are never available through public registration. Administrator privileges are strictly owner-provisioned directly in trusted backend systems.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
            <Link
              to="/"
              className="text-xs sm:text-sm font-medium text-forest hover:text-forest-hover flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Back to Homepage</span>
            </Link>
            <Link
              to="/login"
              className="text-xs sm:text-sm font-semibold text-forest hover:underline"
            >
              Already have an account? Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
