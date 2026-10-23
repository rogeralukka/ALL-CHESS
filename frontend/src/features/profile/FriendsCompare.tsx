import React from 'react';
import { Card } from '@/components/Card';
import { Users, Trophy } from 'lucide-react';

export const FriendsCompare: React.FC = () => {
  // Combine user "You" with fictional friends
  const leaderboard = [
    { rank: 1, username: 'friend_01', rating: 930, winRate: 59.2, games: 142, online: true, isUser: false },
    { rank: 2, username: 'PawnStorm22', rating: 920, winRate: 54.2, games: 97, online: false, isUser: false },
    { rank: 3, username: 'TacticsKnight', rating: 915, winRate: 58.5, games: 78, online: true, isUser: false },
    { rank: 4, username: 'You', rating: 905, winRate: 56.4, games: 105, online: true, isUser: true },
  ].sort((a, b) => b.rating - a.rating);

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-amber-500" />
          <h3 className="font-bold font-display text-theme-text text-base">Friends Leaderboard</h3>
        </div>
        <span className="text-xs text-theme-muted font-medium">Ranked by Rapid Rating</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-theme-border text-xs text-theme-muted uppercase tracking-wider">
              <th className="py-2.5 px-3">#</th>
              <th className="py-2.5 px-3">Player</th>
              <th className="py-2.5 px-3 text-right">Rating</th>
              <th className="py-2.5 px-3 text-right">Win Rate</th>
              <th className="py-2.5 px-3 text-right">Games</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme-border/40">
            {leaderboard.map((item, idx) => (
              <tr
                key={item.username}
                className={`transition-colors ${
                  item.isUser
                    ? 'bg-amber-500/10 font-semibold text-amber-500'
                    : 'hover:bg-theme-raised/50 text-theme-text'
                }`}
              >
                <td className="py-3 px-3 w-10">
                  {idx === 0 ? (
                    <Trophy size={16} className="text-amber-400 inline" />
                  ) : (
                    <span className="text-theme-muted font-bold text-xs">{idx + 1}</span>
                  )}
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.online ? 'bg-emerald-500' : 'bg-neutral-500'
                      }`}
                      title={item.online ? 'Online' : 'Offline'}
                    />
                    <span>{item.username}</span>
                    {item.isUser && (
                      <span className="text-xs bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                        You
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold tabular-nums">
                  {item.rating}
                </td>
                <td className="py-3 px-3 text-right font-mono tabular-nums">
                  {item.winRate}%
                </td>
                <td className="py-3 px-3 text-right text-theme-muted font-mono tabular-nums">
                  {item.games}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
