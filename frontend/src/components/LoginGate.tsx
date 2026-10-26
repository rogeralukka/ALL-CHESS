import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, ShieldCheck, AlertCircle, Link2 } from 'lucide-react';
import { useAuthStore } from '@/data/authStore';

interface LoginGateProps {
  onSuccess?: () => void;
}

/** Input with a leading icon and an optional trailing control, the way the reference sign-in page draws them. */
const Field: React.FC<{
  icon: React.ReactNode;
  trailing?: React.ReactNode;
  label: string;
  hint?: string;
} & React.InputHTMLAttributes<HTMLInputElement>> = ({ icon, trailing, label, hint, className = '', ...rest }) => (
  <label className="block">
    <span className="sr-only">{label}</span>
    <span className="relative flex items-center">
      <span className="absolute left-3.5 text-[#8b8987] pointer-events-none">{icon}</span>
      <input
        aria-label={label}
        {...rest}
        className={`w-full h-[46px] pl-11 ${trailing ? 'pr-11' : 'pr-3'} rounded-[6px] bg-[#312e2b] border border-[#4b4845] text-[16px] text-white placeholder:text-[#8b8987] focus:outline-none focus-visible:!outline-none focus:border-[#81b64c] focus:ring-2 focus:ring-[#81b64c]/25 transition ${className}`}
      />
      {trailing && <span className="absolute right-2.5 flex items-center">{trailing}</span>}
    </span>
    {hint && <span className="block mt-1 text-[12px] text-[#8b8987]">{hint}</span>}
  </label>
);

export const LoginGate: React.FC<LoginGateProps> = ({ onSuccess }) => {
  const { login, error, clearError } = useAuthStore();
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [username, setUsername] = useState('');
  const [chesscomUsername, setChesscomUsername] = useState('');
  const [lichessUsername, setLichessUsername] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode || !username.trim()) return;

    setSubmitting(true);
    clearError();
    try {
      await login({
        passcode,
        username: username.trim(),
        chesscomUsername: chesscomUsername.trim() || undefined,
        lichessUsername: lichessUsername.trim() || undefined,
      });
      onSuccess?.();
    } catch {
      // error is shown from the auth store
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#312e2b]" data-testid="login-gate">
      {/* big low-contrast board in perspective, like the reference sign-in backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] overflow-hidden" style={{ perspective: '700px' }}>
        <div
          className="absolute left-1/2 bottom-[-35%] w-[260%] h-[170%] -translate-x-1/2 origin-bottom"
          style={{
            transform: 'translateX(-50%) rotateX(58deg)',
            background: 'conic-gradient(#3a3835 25%, transparent 0 50%, #3a3835 0 75%, transparent 0) 0 0 / 280px 280px',
            WebkitMaskImage: 'linear-gradient(to top, #000 15%, transparent 85%)',
            maskImage: 'linear-gradient(to top, #000 15%, transparent 85%)',
          }}
        />
      </div>

      <div className="relative min-h-full flex flex-col items-center px-4 pt-10 pb-10 sm:pt-[9vh]">
        <div className="flex items-center gap-3 mb-8 select-none">
          <img src="/assets/ui/logo_king.webp" alt="" className="h-12 w-auto object-contain drop-shadow" />
          <span className="font-display font-black text-[42px] leading-none tracking-[-0.02em] text-white">
            ALL-<span className="text-[#81b64c]">CHESS</span>
          </span>
        </div>

        <div className="w-full max-w-[468px] rounded-[10px] bg-[#262522] shadow-[0_10px_40px_rgba(0,0,0,0.35)] overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-3.5" noValidate>
            {error && (
              <div role="alert" className="flex items-start gap-2 p-3 rounded-[6px] bg-[#fa412d]/15 border border-[#fa412d]/40 text-[14px] text-[#ff8a7a]">
                <AlertCircle size={17} className="flex-shrink-0 mt-px" />
                <span>{error}</span>
              </div>
            )}

            <Field
              label="App passcode"
              icon={<Lock size={18} />}
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
                  className="w-8 h-8 flex items-center justify-center rounded text-[#8b8987] hover:text-white"
                  aria-label={showPasscode ? 'Hide passcode' : 'Show passcode'}
                >
                  {showPasscode ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            <Field
              label="Your name"
              icon={<User size={18} />}
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name"
            />

            <div className="space-y-3.5 pt-1">
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
            </div>

            <button
              type="submit"
              disabled={submitting || !passcode || !username.trim()}
              className="btn-primary w-full h-[62px] rounded-[8px] text-[24px] font-display font-extrabold mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Signing in…' : 'Log In'}
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 py-4 px-5 bg-black/25 text-[14px] text-[#b5b3b0]">
            <ShieldCheck size={16} className="text-[#81b64c] flex-shrink-0" />
            <span>Free and private. Your games stay on your own computer.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
