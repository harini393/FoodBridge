import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Building2, Clock, ShieldCheck, LogOut, CheckCircle2 } from 'lucide-react';

export const NgoApplicationStatusPage: React.FC = () => {
  const { profile, logout } = useAuth();

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
        <PageHeader
          title="NGO Application Status"
          description="Track the verification status of your non-profit organization credentials."
          badge={<StatusBadge status={profile?.accountStatus === 'active' ? 'approved' : 'pendingReview'} />}
          actions={
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              leftIcon={<LogOut className="w-4 h-4" aria-hidden="true" />}
            >
              Sign Out
            </Button>
          }
        />

        <div className="bg-white border border-border-subtle rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-sage flex items-center justify-center text-forest shrink-0">
              <Building2 className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-heading font-bold text-main">
                {profile?.organizationName || 'Your Organization'}
              </h2>
              <p className="text-sm text-muted">
                Officer: <span className="text-main font-medium">{profile?.fullName}</span> ({profile?.email})
              </p>
            </div>
          </div>

          {/* Verification Timeline */}
          <div className="p-4 sm:p-5 rounded-xl bg-cream border border-border-subtle space-y-3">
            <div className="flex items-center gap-2 text-forest font-heading font-semibold text-sm">
              <Clock className="w-4 h-4" aria-hidden="true" />
              <span>Current Status: Administrator Review in Progress</span>
            </div>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              To ensure food safety, recipient protection, and regulatory compliance, non-profit organizations must be reviewed and verified by a FoodBridge Administrator before access to donation coordination tools is granted.
            </p>
          </div>

          {/* Verification Steps Checklist */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
              Verification Requirements
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-muted">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" aria-hidden="true" />
                <span>Account registration and primary officer profile recorded</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" aria-hidden="true" />
                <span>Organization registration credentials submitted</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-harvest shrink-0" aria-hidden="true" />
                <span>Administrator verification of non-profit legal status (Pending)</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-border-subtle flex items-center justify-between text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-forest" aria-hidden="true" />
              Secure Non-Profit Verification
            </span>
            <span>FoodBridge Phase 2 Protocol</span>
          </div>
        </div>
      </div>
    </div>
  );
};
