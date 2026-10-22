import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'raised' | 'flat';
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  children,
  className = '',
  ...props
}) => {
  const variantClasses = {
    default: 'bg-theme-card border border-theme-border shadow-sm',
    raised: 'bg-theme-raised border border-theme-border/80 shadow-md',
    flat: 'bg-theme-card/50 border border-theme-border/40',
  };

  return (
    <div
      className={`rounded-lg p-4 md:p-5 transition-colors ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
