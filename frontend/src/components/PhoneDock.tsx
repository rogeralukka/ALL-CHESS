import React from 'react';
import { createPortal } from 'react-dom';

/**
 * Phones only: a solid strip that sits on top of the bottom tab bar and holds the screen's main button
 * (the green Play bar of the Chess.com app). Content scrolls behind it and stops at its edge, so the button
 * never floats over a board or a list. A spacer of the same height keeps the last row reachable.
 */
export const PhoneDock: React.FC<{ children: React.ReactNode; testId?: string }> = ({ children, testId }) => {
  const dock = (
    <div
      className="sm:hidden fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-30 px-4 pt-2.5 pb-3"
      style={{ background: 'var(--color-page)' }}
      data-testid={testId}
    >
      {children}
    </div>
  );
  return (
    <>
      {/* the dock (~80px) plus the tab bar under it (64px) */}
      <div className="sm:hidden h-[148px] flex-shrink-0" aria-hidden="true" />
      {typeof document !== 'undefined' ? createPortal(dock, document.body) : dock}
    </>
  );
};

export default PhoneDock;
