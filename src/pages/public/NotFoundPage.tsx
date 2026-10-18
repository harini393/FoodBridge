import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-16 px-4 sm:px-6">
      <div className="max-w-md w-full text-center space-y-6 bg-white border border-border-subtle rounded-2xl p-8 sm:p-12 shadow-card">
        <div className="w-16 h-16 rounded-2xl bg-sage flex items-center justify-center text-forest mx-auto">
          <HeartHandshake className="w-8 h-8 text-forest" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-status-warning">
            Error 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-main">
            Page Not Found
          </h1>
          <p className="text-sm text-muted">
            The page you requested could not be located. It may have moved or does not exist.
          </p>
        </div>

        <div className="pt-2">
          <Link to="/">
            <Button
              variant="primary"
              size="md"
              leftIcon={<ArrowLeft className="w-4 h-4" aria-hidden="true" />}
            >
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
