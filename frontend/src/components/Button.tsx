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
    'relative inline-flex items-center justify-center font-display font-bold rounded-[8px] transition-all duration-100 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-theme-page disabled:opacity-50 disabled:pointer-events-none';

  const sizeClasses = {
    sm: 'h-9 px-3.5 text-xs gap-1.5',
    md: 'h-10 px-4 text-sm gap-2',
    lg: 'h-12 px-6 text-[17px] gap-2.5 !rounded-[10px]',
  };

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost:
      'bg-transparent hover:bg-theme-raised text-theme-text/80 hover:text-theme-text active:translate-y-[1px]',
    danger:
      'bg-red-600 hover:bg-red-700 text-white shadow-sm active:translate-y-[1px]',
    highlight:
      'btn-primary font-black',
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
