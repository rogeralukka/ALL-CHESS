import React from 'react';
import { motion } from 'framer-motion';
import { useMotion } from '@/lib/useMotion';

interface PageHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  /** small 3D icon shown before the title */
  icon?: string;
  /** large illustration on the right (WebP from /assets/ui) */
  art?: string;
  /** chips / badges above the title */
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  /** colour of the light pool behind the art */
  tint?: string;
}

/**
 * Hero header used by the non-board pages: a panel with a warm light pool, the page's 3D art
 * sitting fully inside the card on the right (never clipped), title + subtitle + actions on the left. The art floats in gently.
 */
export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon, art, eyebrow, actions, className = '', tint = 'rgba(245,165,36,0.18)' }) => {
  const { isFull, isOff } = useMotion();
  return (
    <section
      className={`panel relative overflow-hidden ${art ? 'min-h-[168px] md:min-h-[188px]' : ''} ${className}`}
      data-testid="page-header"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(520px 260px at 88% 60%, ${tint}, transparent 70%), linear-gradient(100deg, rgba(255,255,255,0.03), transparent 55%)`,
        }}
      />
      {art && (
        <motion.img
          src={art}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="hidden sm:block absolute right-4 top-3 h-[calc(100%-24px)] w-auto max-w-[46%] object-contain object-right pointer-events-none select-none"
          style={{ filter: 'drop-shadow(0 18px 24px rgba(0,0,0,0.45))' }}
          initial={isOff ? false : { opacity: 0, x: 24, y: 8 }}
          animate={isFull ? { opacity: 1, x: 0, y: [0, -4, 0] } : { opacity: 1, x: 0, y: 0 }}
          transition={isFull ? { opacity: { duration: 0.4 }, x: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }, y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 } } : { duration: isOff ? 0 : 0.3 }}
        />
      )}
      <div className="relative px-5 py-5 md:px-7 md:py-6 sm:max-w-[62%] flex flex-col gap-2 justify-center min-h-[inherit]">
        {eyebrow && <div className="flex flex-wrap items-center gap-2">{eyebrow}</div>}
        <div className="flex items-center gap-3">
          {icon && <img src={icon} alt="" aria-hidden="true" className="w-10 h-10 object-contain" style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,.4))' }} />}
          <h1 className="text-[26px] md:text-[30px] leading-tight font-black font-display text-theme-text">{title}</h1>
        </div>
        {subtitle && <p className="text-[14px] md:text-[15px] text-theme-muted leading-relaxed">{subtitle}</p>}
        {actions && <div className="flex flex-wrap items-center gap-2 pt-2">{actions}</div>}
      </div>
    </section>
  );
};

/** Standard page width + padding for non-board pages. */
export const PageContainer: React.FC<{ children: React.ReactNode; className?: string; wide?: boolean }> = ({ children, className = '', wide }) => (
  <div className={`w-full mx-auto px-4 md:px-8 py-5 md:py-7 space-y-5 ${wide ? 'max-w-[1280px]' : 'max-w-[1120px]'} ${className}`}>{children}</div>
);

/** Section title used inside pages (matches the reference's bold section heads). */
export const SectionTitle: React.FC<{ children: React.ReactNode; icon?: React.ReactNode; right?: React.ReactNode }> = ({ children, icon, right }) => (
  <div className="flex items-center justify-between gap-3 mb-3">
    <h2 className="flex items-center gap-2 text-[17px] font-extrabold font-display text-theme-text">
      {icon}
      {children}
    </h2>
    {right}
  </div>
);

export default PageHeader;
