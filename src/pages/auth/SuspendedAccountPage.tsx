import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const SuspendedAccountPage: React.FC = () => {
  const { profile, logout } = useAuth();

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-16 px-4 sm:px-6">
      <div className="max-w-md w-full bg-white border border-status-error/30 rounded-2xl p-8 sm:p-10 shadow-card text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-status-error/10 flex items-center justify-center text-status-error mx-auto">
          <ShieldAlert className="w-8 h-8" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-status-error">
            Access Restricted
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-main">
            Account Suspended
          </h1>
          <p className="text-sm text-muted leading-relaxed">
            Your FoodBridge account has been suspended by a platform administrator. Restricted operations and donation coordination features are blocked.
          </p>
        </div>

        {profile?.suspensionReason && (
          <div className="p-4 rounded-xl bg-[#FEF2F2] border border-status-error/20 text-xs sm:text-sm text-status-error text-left space-y-1">
            <strong>Reason for suspension:</strong>
            <p className="text-main/80">{profile.suspensionReason}</p>
          </div>
        )}

        <div className="pt-2 border-t border-border-subtle">
          <Button
            variant="outline"
            size="md"
            onClick={logout}
            className="w-full"
            leftIcon={<LogOut className="w-4 h-4" aria-hidden="true" />}
          >
            Sign Out of Account
          </Button>
        </div>
      </div>
    </div>
  );
};
