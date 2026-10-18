import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Building2, LogOut, Clock, ShieldCheck } from 'lucide-react';

export const NgoDashboardPlaceholder: React.FC = () => {
  const { profile, logout } = useAuth();

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <PageHeader
          title="NGO Coordination Dashboard"
          description={`Organization: ${profile?.organizationName || 'Verified NGO'}. Manage incoming donations, active recipients, and volunteer assignments.`}
          badge={<StatusBadge status="approved" customLabel="Verified Organization" />}
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
                {profile?.organizationName || 'NGO Coordination Portal'}
              </h2>
              <p className="text-sm text-muted">
                Primary Officer: <span className="text-main font-medium">{profile?.fullName}</span> ({profile?.email})
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-cream border border-border-subtle flex items-start gap-3">
            <Clock className="w-5 h-5 text-forest shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-xs sm:text-sm text-muted leading-relaxed">
              <strong className="text-main font-semibold">Phase 2 Verification Checkpoint:</strong>
              <p className="mt-0.5">
                Approved NGO access verified. Donation review, recipient directory, delivery deadlines, and volunteer dispatching will be implemented in <strong>Phase 5 (NGO Workflow)</strong>.
              </p>
            </div>
          </div>

          <div className="pt-1 flex items-center gap-2 text-xs text-forest font-medium">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            <span>Admin-Approved Organization Access</span>
          </div>
        </div>
      </div>
    </div>
  );
};
