import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { PackageCheck, LogOut, Clock, PlusCircle } from 'lucide-react';

export const DonorDashboardPlaceholder: React.FC = () => {
  const { profile, logout } = useAuth();

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <PageHeader
          title="Food Donor Dashboard"
          description={`Welcome back, ${profile?.fullName || 'Donor'}. Coordinate surplus food donations and track collection outcomes.`}
          badge={<StatusBadge status="active" customLabel="Active Donor" />}
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

        {/* Phase 2 verification banner */}
        <div className="bg-white border border-border-subtle rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-sage flex items-center justify-center text-forest shrink-0">
              <PackageCheck className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-heading font-bold text-main">
                Donor Portal Authenticated
              </h2>
              <p className="text-sm text-muted">
                Authenticated Account: <span className="text-main font-medium">{profile?.email}</span> ({profile?.phone})
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-cream border border-border-subtle flex items-start gap-3">
            <Clock className="w-5 h-5 text-forest shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-xs sm:text-sm text-muted leading-relaxed">
              <strong className="text-main font-semibold">Phase 2 Verification Checkpoint:</strong>
              <p className="mt-0.5">
                Authentication, protected routing, and typed profile storage in Cloud Firestore are active. Structured 4-step donation submission, photo upload, and live status history tracking will be built in <strong>Phase 4 (Donor Workflow)</strong>.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              disabled
              leftIcon={<PlusCircle className="w-4 h-4" aria-hidden="true" />}
            >
              Submit Surplus Food (Phase 4)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
