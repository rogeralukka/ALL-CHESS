import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Lock, User, ShieldCheck, AlertCircle, Link2, Check } from 'lucide-react';
import { useAuthStore } from '@/data/authStore';

interface LoginGateProps {
  onSuccess?: () => void;
}

const PREFS_KEY = 'all_chess_login_prefs';

/** Input with a leading icon and an optional trailing control, the way the reference sign-in page draws them. */
const Field: React.FC<{
  icon: React.ReactNode;
  trailing?: React.ReactNode;
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>> = ({ icon, trailing, label, className = '', ...rest }) => (
  <label className="block">
    <span className="sr-only">{label}</span>
    <span className="relative flex items-center">
      <span className="absolute left-3.5 text-[#a7a6a2] pointer-events-none">{icon}</span>
      <input
        aria-label={label}
        {...rest}
        className={`w-full h-[47px] pl-[46px] ${trailing ? 'pr-11' : 'pr-3'} rounded-[5px] bg-[#2b2926] border border-[#5d5b57] text-[16px] text-white placeholder:text-[#8b8987] focus:outline-none focus-visible:!outline-none focus:border-[#81b64c] focus:ring-2 focus:ring-[#81b64c]/25 transition ${className}`}
      />
      {trailing && <span className="absolute right-2 flex items-center">{trailing}</span>}
    </span>
  </label>
);

/** Large soft diamonds behind the card, like the reference sign-in backdrop. */
const Backdrop: React.FC = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
    <div
      className="absolute left-1/2 top-[56%] w-[190vw] h-[190vw] max-w-[3600px] max-h-[3600px] -translate-x-1/2 -translate-y-1/2"
      style={{
        transform: 'translate(-50%, -50%) scaleY(0.33) rotate(45deg)',
        background: 'conic-gradient(rgba(255,255,255,0.035) 25%, transparent 0 50%, rgba(255,255,255,0.035) 0 75%, transparent 0) 0 0 / 520px 520px',
        WebkitMaskImage: 'radial-gradient(closest-side, #000 55%, transparent 100%)',
        maskImage: 'radial-gradient(closest-side, #000 55%, transparent 100%)',
      }}
    />
  </div>
);

export const LoginGate: React.FC<LoginGateProps> = ({ onSuccess }) => {
  const { login, error, clearError } = useAuthStore();
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [username, setUsername] = useState('');
  const [chesscomUsername, setChesscomUsername] = useState('');
  const [lichessUsername, setLichessUsername] = useState('');
  const [remember, setRemember] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Fill in the names from last time on this device (never the passcode).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (!raw) return;
      const p = JSON.parse(raw) as { username?: string; chesscom?: string; lichess?: string };
      setUsername(p.username ?? '');
      setChesscomUsername(p.chesscom ?? '');
      setLichessUsername(p.lichess ?? '');
    } catch {
      /* storage unavailable: start empty */
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) return setFormError('Enter the app passcode.');
    if (!username.trim()) return setFormError('Enter your name.');
    setFormError('');

    setSubmitting(true);
    clearError();
    try {
      await login({
        passcode,
        username: username.trim(),
        chesscomUsername: chesscomUsername.trim() || undefined,
        lichessUsername: lichessUsername.trim() || undefined,
      });
      try {
        if (remember) {
          localStorage.setItem(PREFS_KEY, JSON.stringify({ username: username.trim(), chesscom: chesscomUsername.trim(), lichess: lichessUsername.trim() }));
        } else {
          localStorage.removeItem(PREFS_KEY);
        }
      } catch {
        /* ignore */
      }
      onSuccess?.();
    } catch {
      // error is shown from the auth store
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#312e2b]" data-testid="login-gate">
      <Backdrop />

      <div className="relative min-h-full flex flex-col items-center px-4 pt-10 pb-10 sm:pt-[11vh]">
        <div className="flex items-center gap-2.5 mb-[34px] select-none">
          <img src="/assets/ui/logo_king.webp" alt="" className="h-[52px] w-auto object-contain drop-shadow" />
          <span className="font-display font-black text-[46px] leading-none tracking-[-0.025em] text-white">
            ALL-<span className="text-[#81b64c]">CHESS</span>
          </span>
        </div>

        <div className="w-full max-w-[469px] rounded-[8px] bg-[#262522] shadow-[0_12px_44px_rgba(0,0,0,0.35)] overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-[47px] sm:pb-[40px] space-y-[18px]" noValidate>
            {(formError || error) && (
              <div role="alert" className="flex items-start gap-2 p-3 rounded-[5px] bg-[#fa412d]/15 border border-[#fa412d]/40 text-[14px] text-[#ff8a7a]">
                <AlertCircle size={17} className="flex-shrink-0 mt-px" />
                <span>{formError || error}</span>
              </div>
            )}

            <Field
              label="App passcode"
              icon={<Lock size={18} fill="currentColor" />}
              type={showPasscode ? 'text' : 'password'}
              autoFocus
              autoComplete="current-password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="App passcode"
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPasscode((v) => !v)}
                  className="w-9 h-9 flex items-center justify-center rounded text-[#a7a6a2] hover:text-white"
                  aria-label={showPasscode ? 'Hide passcode' : 'Show passcode'}
                >
                  {showPasscode ? <EyeOff size={20} /> : <Eye size={20} fill="currentColor" className="[&_circle]:fill-[#2b2926]" />}
                </button>
              }
            />

            <Field
              label="Your name"
              icon={<User size={19} fill="currentColor" />}
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name"
            />

            <Field
              label="Chess.com username (optional)"
              icon={<Link2 size={18} />}
              type="text"
              value={chesscomUsername}
              onChange={(e) => setChesscomUsername(e.target.value)}
              placeholder="Chess.com username (optional)"
            />
            <Field
              label="Lichess username (optional)"
              icon={<Link2 size={18} />}
              type="text"
              value={lichessUsername}
              onChange={(e) => setLichessUsername(e.target.value)}
              placeholder="Lichess username (optional)"
            />

            <div className="flex items-center justify-between text-[16px] text-[#c3c2c0] !mt-[14px]">
              <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="sr-only peer" />
                <span className="w-[17px] h-[17px] rounded-[3px] border border-[#8b8987] bg-transparent flex items-center justify-center peer-checked:bg-[#c3c2c0] peer-checked:border-[#c3c2c0] peer-focus-visible:ring-2 peer-focus-visible:ring-[#81b64c]/60 [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100">
                  <Check size={13} strokeWidth={4} className="text-[#262522]" />
                </span>
                Remember me
              </label>
              <button type="button" onClick={() => setShowHint((v) => !v)} className="underline underline-offset-2 hover:text-white" aria-expanded={showHint}>
                Forgot passcode?
              </button>
            </div>
            {showHint && (
              <p className="text-[14px] leading-relaxed text-[#b5b3b0] bg-black/20 rounded-[5px] px-3 py-2.5 !mt-3" data-testid="passcode-hint">
                The passcode is the <code className="text-[#f7c631]">APP_PASSCODE</code> value in the backend's <code className="text-[#f7c631]">.env</code> file on the computer running ALL-CHESS.
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full h-[75px] rounded-[8px] text-[26px] font-display font-extrabold !mt-[22px] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Signing in…' : 'Log In'}
            </button>
          </form>

          <div className="flex items-center justify-center gap-2.5 h-[70px] px-5 bg-[#201f1c] text-[16px] text-[#c3c2c0] text-center whitespace-nowrap">
            <ShieldCheck size={18} className="text-[#81b64c] flex-shrink-0" />
            <span>Free and private. Your games stay on your computer.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
