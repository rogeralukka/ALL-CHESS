import React, { useCallback, useContext, useEffect } from 'react';
import { UNSAFE_DataRouterContext, useBlocker } from 'react-router-dom';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';

type Props = {
  /** Guard is armed only while this is true (a game is running, a puzzle is open, a review is on screen). */
  when: boolean;
  /** true: only the back/forward buttons ask. false: every way out of the screen asks (tab bar, links). */
  onlyBack?: boolean;
  title: string;
  message: string;
  leaveLabel?: string;
  stayLabel?: string;
};

const Guard: React.FC<Props> = ({ when, onlyBack = true, title, message, leaveLabel = 'Leave', stayLabel = 'Stay' }) => {
  const blocker = useBlocker(
    useCallback(
      ({ historyAction }: { historyAction: string }) => when && (!onlyBack || historyAction === 'POP'),
      [when, onlyBack],
    ),
  );

  // Reloading or closing the tab also throws the screen away, so the browser's own prompt covers that case
  useEffect(() => {
    if (!when) return undefined;
    const onUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, [when]);

  // The guard switched off while the question was open (the game ended): let the person through
  useEffect(() => {
    if (!when && blocker.state === 'blocked') blocker.proceed();
  }, [when, blocker]);

  const open = when && blocker.state === 'blocked';
  return (
    <Modal isOpen={open} onClose={() => blocker.state === 'blocked' && blocker.reset()} title={title} maxWidth="sm">
      <p className="text-[15px] text-theme-muted leading-snug" data-testid="leave-guard-message">
        {message}
      </p>
      <div className="mt-5 flex flex-col gap-2.5">
        <Button variant="primary" size="lg" fullWidth onClick={() => blocker.state === 'blocked' && blocker.reset()} data-testid="leave-guard-stay">
          {stayLabel}
        </Button>
        <Button variant="secondary" size="lg" fullWidth onClick={() => blocker.state === 'blocked' && blocker.proceed()} data-testid="leave-guard-leave">
          {leaveLabel}
        </Button>
      </div>
    </Modal>
  );
};

/**
 * Asks "leave or stay?" before the phone's back button (or, with onlyBack=false, any link) takes the person
 * out of a game, puzzle or review. Needs the app's data router; in a plain MemoryRouter (some unit tests) it does nothing.
 */
export const LeaveGuard: React.FC<Props> = (props) => {
  const inDataRouter = useContext(UNSAFE_DataRouterContext) != null;
  return inDataRouter ? <Guard {...props} /> : null;
};

export default LeaveGuard;
