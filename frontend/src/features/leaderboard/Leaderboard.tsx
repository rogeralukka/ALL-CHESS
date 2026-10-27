import React, { useEffect, useMemo, useState } from 'react';
import { InlineLoader } from '@/components/LoadingScreen';
import { ChevronRight, Plus, Users } from 'lucide-react';
import { PageContainer } from '@/components/PageHeader';
import { PageTitle, FilterBar, FilterDropdown, StatTile } from '@/components/ListUI';
import { PlayerAvatar } from '@/components/Bits';
import { ModeIcon, GameMode } from '@/components/ModeIcon';
import { toast } from '@/components/Toast';
import { friendRepository, gameRepository, statsRepository } from '@/data/repositories';
import { Friend, Game } from '@/data/types';
import { useCurrentUser } from '@/lib/useCurrentUser';

type Speed = 'rapid' | 'blitz' | 'bullet';
type SpeedFilter = Speed | 'all';
type Scope = 'friends' | 'opponents';

interface Row {
  name: string;
  rating: number;
  you?: boolean;
  bot?: boolean;
  online?: boolean;
  avatarUrl?: string;
  /** results against you (opponents scope only) */
  vsYou?: { w: number; d: number; l: number };
}

const SPEEDS: Speed[] = ['rapid', 'blitz', 'bullet'];
const LABEL: Record<Speed, string> = { rapid: 'Rapid', blitz: 'Blitz', bullet: 'Bullet' };

/** Gold / silver / bronze squares for the podium, plain "#4" after that. */
const RankSquare: React.FC<{ rank: number }> = ({ rank }) => {
  if (rank > 3) return <span className="w-10 h-10 flex items-center justify-center text-[15px] font-display font-bold text-theme-muted tabular-nums">#{rank}</span>;
  const bg = rank === 1 ? '#f7c631' : rank === 2 ? '#bebdb9' : '#a1630f';
  const fg = rank === 3 ? '#f0b84a' : '#ffffff';
  return (
    <span
      className="w-10 h-10 flex items-center justify-center rounded-[3px] text-[18px] font-display font-extrabold"
      style={{ background: bg, color: fg, boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.18)' }}
      aria-label={`Rank ${rank}`}
    >
      {rank}
    </span>
  );
};

const RowItem: React.FC<{ row: Row; rank: number; label: string }> = ({ row, rank, label }) => (
  <li className={`flex items-center gap-3 h-[52px] ${row.you ? 'rounded-[4px] bg-[#81b64c]/[0.12]' : ''}`} data-testid={row.you ? 'leaderboard-you' : undefined}>
    <RankSquare rank={rank} />
    <span className="relative flex-shrink-0">
      <PlayerAvatar name={row.you ? 'You' : row.name} src={row.avatarUrl} size={36} square />
      {row.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#81b64c] border-2 border-[var(--color-card)]" />}
    </span>
    <span className="flex-1 min-w-0 flex items-center gap-2">
      <span className="text-[15px] font-bold text-theme-text truncate">{label}</span>
      {row.you && <span className="text-[11px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-[#81b64c] text-[#1f2d12]">You</span>}
      {row.bot && <span className="text-[11px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-white/10 text-theme-muted">Bot</span>}
    </span>
    {row.vsYou && (
      <span className="hidden sm:block text-[13px] text-theme-muted tabular-nums" title="Their results against you: won / drawn / lost">
        {row.vsYou.w}-{row.vsYou.d}-{row.vsYou.l}
      </span>
    )}
    <span className="w-14 text-right text-[16px] font-bold text-theme-text tabular-nums pr-1">{row.rating}</span>
  </li>
);

export const Leaderboard: React.FC = () => {
  const me = useCurrentUser();
  const [speed, setSpeed] = useState<SpeedFilter>('all');
  const [scope, setScope] = useState<Scope>('friends');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [mine, setMine] = useState<{ mode: string; rating: number }[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [newFriend, setNewFriend] = useState('');
  const [adding, setAdding] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const load = () =>
    Promise.all([friendRepository.getFriends(), gameRepository.getGames(), statsRepository.getUserRatings()]).then(([f, g, r]) => {
      setFriends(f);
      setGames(g);
      setMine(r);
    }).catch(() => undefined).finally(() => setLoaded(true));

  useEffect(() => {
    load();
  }, []);

  const myRating = (s: Speed) => mine.find((r) => r.mode.toLowerCase() === s)?.rating ?? 0;

  const rowsFor = useMemo(
    () =>
      (s: Speed): Row[] => {
        const you: Row = { name: me.username, rating: myRating(s), you: true, online: true, avatarUrl: me.avatarUrl ?? undefined };
        const all: Row[] = [];
        if (scope === 'friends') {
          for (const f of friends) {
            const r = f.ratings?.[s] ?? 0;
            if (r > 0) all.push({ name: f.username, rating: r, online: f.online, avatarUrl: f.avatarUrl });
          }
        } else {
          const map = new Map<string, Row>();
          for (const g of games) {
            if (g.speed !== s) continue;
            const youWhite = g.white.username === 'You';
            const opp = youWhite ? g.black : g.white;
            const row = map.get(opp.username) ?? { name: opp.username, rating: 0, bot: g.source === 'vs_coach', vsYou: { w: 0, d: 0, l: 0 } };
            const youWon = (youWhite && g.result === '1-0') || (!youWhite && g.result === '0-1');
            if (g.result === '1/2-1/2') row.vsYou!.d++;
            else if (youWon) row.vsYou!.l++;
            else row.vsYou!.w++;
            row.rating = Math.max(row.rating, opp.rating);
            map.set(opp.username, row);
          }
          all.push(...[...map.values()].filter((r) => r.rating > 0));
        }
        if (you.rating > 0) all.push(you);
        return all.sort((a, b) => b.rating - a.rating);
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scope, friends, games, mine, me.username, me.avatarUrl],
  );

  const shown: Speed[] = speed === 'all' ? SPEEDS : [speed];

  const addFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newFriend.trim();
    if (!name || adding) return;
    setAdding(true);
    try {
      await friendRepository.addFriend(name);
      setNewFriend('');
      toast.success('Friend added', `${name} is on your leaderboard.`);
      await load();
    } catch (err) {
      toast.error('Could not add friend', err instanceof Error ? err.message : 'Check the Chess.com username and try again.');
    } finally {
      setAdding(false);
    }
  };

  const bestRating = Math.max(0, ...SPEEDS.map(myRating));

  if (!loaded) {
    return (
      <PageContainer wide className="!max-w-[1100px]">
        <PageTitle icon="/assets/ui/icon_leaderboard.webp" title="Leaderboard" />
        <InlineLoader label="Loading the leaderboard…" size={130} className="py-20" />
      </PageContainer>
    );
  }

  return (
    <PageContainer wide className="!max-w-[1100px]">
      <PageTitle icon="/assets/ui/icon_leaderboard.webp" title="Leaderboard" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">
        <div className="space-y-4 min-w-0">
          <FilterBar>
            <FilterDropdown<SpeedFilter>
              ariaLabel="Game type"
              value={speed}
              onChange={setSpeed}
              options={[
                { value: 'all', label: 'All Game Types', icon: <img src="/assets/ui/icon_play.webp" alt="" className="w-8 h-8 object-contain" /> },
                ...SPEEDS.map((s) => ({ value: s, label: LABEL[s], icon: <ModeIcon mode={s as GameMode} size={26} /> })),
              ]}
            />
            <FilterDropdown<Scope>
              ariaLabel="Who to compare with"
              value={scope}
              onChange={setScope}
              options={[
                { value: 'friends', label: 'Friends', icon: <Users size={26} className="text-[#81b64c]" /> },
                { value: 'opponents', label: 'People you played', icon: <img src="/assets/ui/icon_review.webp" alt="" className="w-8 h-8 object-contain" /> },
              ]}
            />
          </FilterBar>

          {scope === 'friends' && (
            <form onSubmit={addFriend} className="cc-card flex items-center gap-3 p-3" data-testid="add-friend-form">
              <input
                value={newFriend}
                onChange={(e) => setNewFriend(e.target.value)}
                placeholder="Add a friend by their Chess.com username"
                aria-label="Friend's Chess.com username"
                className="flex-1 h-11 px-4 rounded-[5px] text-[15px] text-theme-text placeholder:text-theme-muted focus:outline-none focus-visible:!outline-none border border-transparent focus:border-[#81b64c]"
                style={{ background: 'var(--input-bg)' }}
              />
              <button type="submit" disabled={!newFriend.trim() || adding} className="btn-primary h-11 px-5 rounded-[5px] text-[15px] font-extrabold inline-flex items-center gap-1.5 disabled:opacity-60">
                <Plus size={17} /> {adding ? 'Adding…' : 'Add'}
              </button>
            </form>
          )}

          {shown.map((s) => {
            const rows = rowsFor(s);
            const open = !!expanded[s] || speed !== 'all';
            const list = open ? rows : rows.slice(0, 5);
            const youIdx = rows.findIndex((r) => r.you);
            const youHidden = !open && youIdx >= 5;
            return (
              <section key={s} className="cc-card overflow-hidden" data-testid={`leaderboard-${s}`}>
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-[170px] flex sm:flex-col items-center justify-center gap-3 px-5 pt-5 sm:py-6">
                    <ModeIcon mode={s as GameMode} size={60} />
                    <h2 className="text-[22px] font-display font-extrabold text-theme-text">{LABEL[s]}</h2>
                  </div>
                  <div className="flex-1 min-w-0 px-4 sm:px-2 py-4 sm:pr-6">
                    {rows.length === 0 ? (
                      <p className="py-8 text-[14px] text-theme-muted text-center sm:text-left">
                        {scope === 'friends' ? `No ${LABEL[s].toLowerCase()} ratings yet. Add a friend above to compare.` : `You haven't played any ${LABEL[s].toLowerCase()} games yet.`}
                      </p>
                    ) : (
                      <ul className="space-y-1.5">
                        {list.map((r, i) => (
                          <RowItem key={r.name} row={r} rank={i + 1} label={r.you ? me.username : r.name} />
                        ))}
                        {youHidden && (
                          <>
                            <li aria-hidden="true" className="text-center text-theme-muted leading-3">⋯</li>
                            <RowItem row={rows[youIdx]} rank={youIdx + 1} label={me.username} />
                          </>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
                {speed === 'all' && rows.length > 5 && (
                  <button
                    type="button"
                    onClick={() => setExpanded((e) => ({ ...e, [s]: !e[s] }))}
                    className="w-full h-12 flex items-center justify-center gap-1.5 border-t border-white/[0.06] text-[15px] font-bold text-theme-muted hover:text-theme-text hover:bg-white/[0.03]"
                  >
                    {expanded[s] ? 'Show Less' : 'See All'} <ChevronRight size={16} className={expanded[s] ? '-rotate-90' : 'rotate-90'} />
                  </button>
                )}
              </section>
            );
          })}
          {scope === 'opponents' && <p className="text-[13px] text-theme-muted px-1">The three numbers show their record against you: won - drawn - lost.</p>}
        </div>

        <aside className="cc-card px-4 py-1 divide-y divide-white/[0.06]">
          <StatTile stack flat icon={<Users size={34} className="text-[#81b64c]" />} value={friends.length} label="Friends" />
          <StatTile stack flat icon={<img src="/assets/ui/icon_review.webp" alt="" className="w-12 h-12 object-contain" />} value={games.length} label="Games synced" />
          <StatTile stack flat icon={<img src="/assets/ui/icon_leaderboard.webp" alt="" className="w-12 h-12 object-contain" />} value={bestRating > 0 ? bestRating : '–'} label="Your best rating" />
        </aside>
      </div>
    </PageContainer>
  );
};

export default Leaderboard;
