import React from 'react';
import { Loader2, AlertCircle, Inbox, RefreshCw } from 'lucide-react';
import { Button } from './Button';

// Loading State
export interface LoadingStateProps {
  message?: string;
  fullPage?: boolean;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  fullPage = false,
  className = '',
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center p-8 text-center ${
        fullPage ? 'min-h-[50vh]' : 'py-12'
      } ${className}`}
    >
      <Loader2
        className="w-8 h-8 animate-spin text-forest mb-3 shrink-0"
        aria-hidden="true"
      />
      <p className="text-sm font-medium text-muted">{message}</p>
      <span className="sr-only">{message}</span>
    </div>
  );
};

// Skeleton Placeholder
export interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-[#E6ECE6] rounded ${className}`}
    />
  );
};

// Empty State
export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white border border-border-subtle rounded-xl max-w-lg mx-auto ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-sage flex items-center justify-center text-forest mb-4 shrink-0">
        {icon || <Inbox className="w-6 h-6" aria-hidden="true" />}
      </div>
      <h3 className="text-lg font-heading font-semibold text-main mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-muted mb-5 max-w-sm leading-relaxed">
        {description}
      </p>
      {action && (
        <Button variant="primary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

// Error State
export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white border border-status-error/30 rounded-xl max-w-lg mx-auto ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-status-error/10 flex items-center justify-center text-status-error mb-4 shrink-0">
        <AlertCircle className="w-6 h-6" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-heading font-semibold text-main mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-muted mb-5 max-w-sm leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-4 h-4" aria-hidden="true" />}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};
