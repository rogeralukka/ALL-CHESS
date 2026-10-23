import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'highlight';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  fullWidth = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'relative inline-flex items-center justify-center font-semibold rounded-md transition-all select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

  const sizeClasses = {
    sm: 'h-10 px-3.5 text-sm gap-1.5',
    md: 'h-11 px-4 text-sm gap-2',
    lg: 'h-12 px-6 text-[15px] gap-2.5',
  };

  const variantClasses = {
    primary:
      'btn-primary text-black dark:text-neutral-900 border border-amber-400/40',
    secondary:
      'bg-theme-card hover:bg-theme-raised text-theme-text border border-theme-border shadow-sm',
    ghost:
      'bg-transparent hover:bg-theme-raised text-theme-text/80 hover:text-theme-text',
    danger:
      'bg-red-600 hover:bg-red-700 text-white shadow-sm',
    highlight:
      'bg-amber-500 hover:bg-amber-600 text-black dark:text-neutral-900 font-bold shadow-sm',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
