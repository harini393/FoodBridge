import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, LogOut, Clock, FileSpreadsheet } from 'lucide-react';

export const AdminDashboardPlaceholder: React.FC = () => {
  const { profile, logout } = useAuth();

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <PageHeader
          title="Platform Administration"
          description="Owner-provisioned governance, NGO verification, account status management, and audit history."
          badge={<StatusBadge status="active" customLabel="System Administrator" />}
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
              <ShieldAlert className="w-6 h-6 text-forest" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-heading font-bold text-main">
                Owner-Provisioned Administrative Session
              </h2>
              <p className="text-sm text-muted">
                Admin UID: <span className="font-mono text-xs">{profile?.uid}</span> ({profile?.email})
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-cream border border-border-subtle flex items-start gap-3">
            <Clock className="w-5 h-5 text-forest shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-xs sm:text-sm text-muted leading-relaxed">
              <strong className="text-main font-semibold">Phase 2 Verification Checkpoint:</strong>
              <p className="mt-0.5">
                Admin access is strictly restricted to accounts with role &lsquo;admin&rsquo; set directly in trusted Firestore records. NGO application review, account suspension, audit logging, and authorized CSV reporting will be built in <strong>Phase 7 (Admin Workflow)</strong>.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              disabled
              leftIcon={<FileSpreadsheet className="w-4 h-4" aria-hidden="true" />}
            >
              CSV Operational Export (Phase 7)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
