import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'raised' | 'flat';
  /** lift + amber edge on hover, for clickable cards */
  interactive?: boolean;
  children: React.ReactNode;
  className?: string;
}

/** Panel surface shared by every page (same depth as the puzzle side panel). */
export const Card: React.FC<CardProps> = ({ variant = 'default', interactive = false, children, className = '', ...props }) => {
  const variantClasses = {
    default: 'panel',
    raised: 'panel !bg-theme-raised',
    flat: 'rounded-xl bg-black/[0.04] dark:bg-black/20 border border-theme-border',
  };
  return (
    <div className={`p-4 md:p-5 ${variantClasses[variant]} ${interactive ? 'panel-hover cursor-pointer' : ''} ${className}`} {...props}>
      {children}
    </div>
  );
};
