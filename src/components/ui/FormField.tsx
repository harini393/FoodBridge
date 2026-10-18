import React from 'react';

export interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  helpText?: string;
  error?: string;
  children: (props: {
    id: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean;
    'aria-required'?: boolean;
  }) => React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  required = false,
  helpText,
  error,
  children,
  className = '',
}) => {
  const helpTextId = helpText ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  // Compose aria-describedby with error taking priority
  const describedBy = [errorId, helpTextId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-sm font-medium text-main select-none flex items-center gap-1"
        >
          {label}
          {required && (
            <span className="text-status-error font-semibold" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {required && (
          <span className="text-[11px] text-muted sr-only">Required field</span>
        )}
      </div>

      {children({
        id,
        'aria-describedby': describedBy,
        'aria-invalid': Boolean(error),
        'aria-required': required,
      })}

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-xs font-medium text-status-error flex items-center gap-1 mt-0.5"
        >
          <span>{error}</span>
        </p>
      ) : helpText ? (
        <p id={helpTextId} className="text-xs text-muted mt-0.5">
          {helpText}
        </p>
      ) : null}
    </div>
  );
};
