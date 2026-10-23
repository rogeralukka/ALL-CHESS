import React from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { CoachSpeech } from '@/features/coach/CoachSpeech';
import { ScoutProfile as ScoutProfileType } from '@/data/types';
import { ArrowLeft, Swords, ShieldAlert, BookOpen, History, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ScoutProfileProps {
  profile: ScoutProfileType;
  onBack: () => void;
}

export const ScoutProfile: React.FC<ScoutProfileProps> = ({ profile, onBack }) => {
  const navigate = useNavigate();

  // Custom coach advice generated per scout profile
  const coachNotes =
    profile.winRate > 60
      ? `${profile.username} is dangerous with high opening preparation (${profile.winRate}% win rate). Try deviating early into sidelines to force them into independent calculation!`
      : `${profile.username} maintains a steady ${profile.winRate}% win rate. Their opening repertoire is predictable—target their lower accuracy in middlegame pawn transitions.`;

  return (
    <div className="space-y-6">
      {/* Back button & Title */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft size={16} />}
          onClick={onBack}
        >
          Back to Scout Search
        </Button>
        <span className="text-xs bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
          Scout Report
        </span>
      </div>

      {/* Opponent Header Banner */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-theme-raised border-2 border-amber-500 flex items-center justify-center font-display font-black text-xl text-amber-500 shadow-inner">
              {profile.username.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black font-display text-theme-text">{profile.username}</h2>
                {profile.title && (
                  <span className="text-xs bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded font-black">
                    {profile.title}
                  </span>
                )}
              </div>
              <p className="text-xs text-theme-muted mt-0.5">
                Rapid Rating <strong className="font-mono text-amber-500">{profile.rating}</strong> • Overall Win Rate{' '}
                <strong className="text-emerald-500">{profile.winRate}%</strong>
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            icon={<Swords size={18} />}
            onClick={() => navigate('/play')}
          >
            Prep Against Playstyle
          </Button>
        </div>
      </Card>

      {/* Coach Prep Assessment */}
      <div className="p-5 rounded-xl bg-theme-card border border-theme-border shadow-sm space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500">Coach Repertoire Assessment</h4>
        <CoachSpeech expression="thinking" size={80} text={coachNotes} />
      </div>

      {/* Opening Repertoire Breakdown */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-amber-500" />
          <h3 className="font-bold font-display text-theme-text text-base">
            Primary Opening Repertoire
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-theme-border text-xs text-theme-muted uppercase tracking-wider">
                <th className="py-2.5 px-3">ECO</th>
                <th className="py-2.5 px-3">Opening</th>
                <th className="py-2.5 px-3 text-right">Games</th>
                <th className="py-2.5 px-3 text-right">Win / Draw / Loss</th>
                <th className="py-2.5 px-3 text-right">Accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-border/40">
              {profile.mostPlayed.map((op) => (
                <tr key={op.eco} className="hover:bg-theme-raised/50 transition-colors">
                  <td className="py-3 px-3 font-mono text-xs text-amber-500 font-bold">
                    {op.eco}
                  </td>
                  <td className="py-3 px-3 font-semibold text-theme-text">
                    {op.name}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-theme-muted">
                    {op.games}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-xs tabular-nums">
                    <span className="text-emerald-500 font-bold">{op.winRate}%</span> /{' '}
                    <span className="text-neutral-400">{op.drawRate}%</span> /{' '}
                    <span className="text-red-500">{op.lossRate}%</span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-theme-text">
                    {op.avgAccuracy}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Exploitable Tendencies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-emerald-500" />
            <h4 className="font-bold font-display text-theme-text text-sm">Targeted Strengths</h4>
          </div>
          <ul className="text-xs text-theme-muted space-y-2 list-disc list-inside">
            <li>Executes well-known book lines deeply without burning clock time.</li>
            <li>Maintains high tactical accuracy in open king positions.</li>
            <li>Disciplined pawn structure throughout the opening phase.</li>
          </ul>
        </Card>

        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} className="text-red-500" />
            <h4 className="font-bold font-display text-theme-text text-sm">Exploitable Weaknesses</h4>
          </div>
          <ul className="text-xs text-theme-muted space-y-2 list-disc list-inside">
            <li>Lower win rate when facing closed centers and slow maneuvering lines.</li>
            <li>Prone to time trouble in complex minor piece endgames.</li>
            <li>Higher blunder frequency when defending back-rank threats.</li>
          </ul>
        </Card>
      </div>

      {/* Recent Games */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <History size={18} className="text-amber-500" />
          <h3 className="font-bold font-display text-theme-text text-base">Recent Games Analyzed</h3>
        </div>
        <div className="space-y-2">
          {profile.recentGames.map((g) => (
            <div
              key={g.id}
              className="flex items-center justify-between p-3 rounded-lg bg-theme-raised border border-theme-border hover:border-amber-500/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded bg-theme-card border border-theme-border text-theme-muted">
                  {g.speed}
                </span>
                <div>
                  <div className="text-sm font-semibold text-theme-text">
                    {g.white.username} ({g.white.rating}) vs {g.black.username} ({g.black.rating})
                  </div>
                  <div className="text-xs text-theme-muted">{g.opening.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono font-bold text-amber-500">{g.result}</span>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => navigate(`/review/${g.id}`)}
                >
                  Review Game
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
