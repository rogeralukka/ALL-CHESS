import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Puzzle } from 'lucide-react';
import { useMotion } from '@/lib/useMotion';

/** 404: the knight fell off the board. */
export const NotFound: React.FC = () => {
  const { pathname } = useLocation();
  const { isFull, isOff } = useMotion();
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-10" data-testid="not-found">
      <div className="panel relative overflow-hidden w-full max-w-[880px] p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(520px 300px at 30% 60%, rgba(245,165,36,0.18), transparent 70%)' }} />
        <motion.img
          src="/assets/ui/hero_404.webp"
          alt=""
          aria-hidden="true"
          className="relative w-[260px] md:w-[360px] max-w-full object-contain"
          style={{ filter: 'drop-shadow(0 16px 20px rgba(0,0,0,.45))' }}
          initial={isOff ? false : { opacity: 0, y: 16, rotate: -3 }}
          animate={isFull ? { opacity: 1, y: [0, -6, 0], rotate: 0 } : { opacity: 1, y: 0, rotate: 0 }}
          transition={isFull ? { opacity: { duration: 0.4 }, rotate: { duration: 0.5 }, y: { duration: 5, repeat: Infinity, ease: 'easeInOut' } } : { duration: 0.3 }}
        />
        <div className="relative text-center md:text-left space-y-3">
          <div className="font-display font-black text-[64px] leading-none text-amber-500" style={{ textShadow: '0 4px 0 rgba(0,0,0,.35)' }}>
            404
          </div>
          <h1 className="text-[26px] md:text-[30px] font-black font-display text-theme-text leading-tight">This square is off the board</h1>
          <p className="text-[15px] text-theme-muted leading-relaxed max-w-md">
            Our knight jumped to <span className="font-bold text-theme-text break-all">{pathname}</span> and tipped over. That page doesn&apos;t exist, but your games and lessons are right where you left them.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
            <Link to="/" className="btn-primary inline-flex items-center gap-2 h-12 px-6 rounded-[12px] font-display font-extrabold text-[15px]">
              <Home size={18} /> Back home
            </Link>
            <Link to="/puzzles" className="btn-secondary inline-flex items-center gap-2 h-12 px-6 rounded-[12px] font-display font-extrabold text-[15px]">
              <Puzzle size={18} /> Solve a puzzle
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
