import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { useAuthStore } from '@/data/authStore';
import { Shield, KeyRound, AlertCircle } from 'lucide-react';

interface LoginGateProps {
  onSuccess?: () => void;
}

export const LoginGate: React.FC<LoginGateProps> = ({ onSuccess }) => {
  const { login, error, clearError } = useAuthStore();
  const [passcode, setPasscode] = useState('');
  const [username, setUsername] = useState('');
  const [chesscomUsername, setChesscomUsername] = useState('');
  const [lichessUsername, setLichessUsername] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode || !username) return;

    setSubmitting(true);
    clearError();
    try {
      await login({
        passcode,
        username,
        chesscomUsername: chesscomUsername.trim() || undefined,
        lichessUsername: lichessUsername.trim() || undefined,
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch {
      // error handled in authStore
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="max-w-md w-full p-6 sm:p-7 space-y-5 bg-theme-page border-theme-border shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <img
              src="/assets/ui/logo_king.webp"
              alt="ALL-CHESS"
              className="w-12 h-14 object-contain drop-shadow-md"
            />
          </div>
          <h2 className="text-xl font-display font-black text-theme-text tracking-tight">
            Welcome to ALL-CHESS
          </h2>
          <p className="text-xs text-theme-muted">
            Private, self-hosted chess analysis. Enter your app passcode to continue.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle size={15} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-theme-text flex items-center gap-1.5">
              <KeyRound size={13} className="text-amber-500" />
              <span>App Passcode <span className="text-red-400">*</span></span>
            </label>
            <input
              type="password"
              required
              autoFocus
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode..."
              className="w-full px-3 py-2.5 bg-theme-raised border border-theme-border rounded-lg text-xs text-theme-text font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-theme-text">
              Display Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username..."
              className="w-full px-3 py-2.5 bg-theme-raised border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-theme-text">
                Chess.com User
              </label>
              <input
                type="text"
                value={chesscomUsername}
                onChange={(e) => setChesscomUsername(e.target.value)}
                placeholder="optional"
                className="w-full px-3 py-2 bg-theme-raised border border-theme-border rounded-lg text-xs text-theme-text font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-theme-text">
                Lichess User
              </label>
              <input
                type="text"
                value={lichessUsername}
                onChange={(e) => setLichessUsername(e.target.value)}
                placeholder="optional"
                className="w-full px-3 py-2 bg-theme-raised border border-theme-border rounded-lg text-xs text-theme-text font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              disabled={submitting || !passcode || !username}
            >
              {submitting ? 'Authenticating...' : 'Enter ALL-CHESS'}
            </Button>
          </div>
        </form>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-theme-muted pt-1">
          <Shield size={12} className="text-amber-500" />
          <span>Sessions are stored securely in HTTP-only cookies</span>
        </div>
      </Card>
    </div>
  );
};
