import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-forest text-white hover:bg-forest-hover active:bg-forest-dark border border-transparent shadow-subtle',
  secondary:
    'bg-sage text-forest hover:bg-[#DCEAD9] active:bg-[#CFE2CC] border border-transparent',
  outline:
    'bg-white text-main hover:bg-sage-light active:bg-sage border border-border-subtle shadow-subtle',
  text:
    'bg-transparent text-forest hover:bg-sage/40 active:bg-sage/70 border border-transparent',
  destructive:
    'bg-status-error text-white hover:bg-[#9B1E15] active:bg-[#851911] border border-transparent shadow-subtle',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs font-medium rounded-md gap-1.5 min-h-[34px]',
  md: 'px-4 py-2 text-sm font-medium rounded-lg gap-2 min-h-[40px]',
  lg: 'px-5 py-2.5 text-base font-semibold rounded-lg gap-2.5 min-h-[46px]',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      className = '',
      type = 'button',
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading || undefined}
        className={`inline-flex items-center justify-center font-body transition-colors duration-150 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...rest}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" aria-hidden="true" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
