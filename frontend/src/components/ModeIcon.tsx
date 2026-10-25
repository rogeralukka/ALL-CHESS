import React from 'react';

/**
 * Flat two-tone game-mode icons (our own drawings), in the reference's style:
 * a solid colour with one darker shade, no outline, readable at 16-40px.
 */
export type GameMode = 'rapid' | 'blitz' | 'bullet' | 'daily' | 'puzzles' | 'coach';

export const MODE_COLOR: Record<GameMode, string> = {
  rapid: '#81b64c',
  blitz: '#f7c631',
  bullet: '#e3aa24',
  daily: '#f7a531',
  puzzles: '#fa742c',
  coach: '#5ec1e6',
};

export const ModeIcon: React.FC<{ mode: GameMode; size?: number; className?: string; title?: string }> = ({ mode, size = 24, className = '', title }) => {
  const c = MODE_COLOR[mode];
  const common = { width: size, height: size, viewBox: '0 0 32 32', className, role: title ? 'img' : undefined, 'aria-label': title, 'aria-hidden': title ? undefined : true } as const;
  switch (mode) {
    case 'rapid':
      return (
        <svg {...common}>
          <rect x="13" y="2" width="6" height="4" rx="1.5" fill={c} />
          <rect x="22.6" y="6.2" width="4" height="3.2" rx="1.2" transform="rotate(45 24.6 7.8)" fill={c} />
          <circle cx="16" cy="18" r="12" fill={c} />
          <circle cx="16" cy="18" r="8.6" fill="#2f4a1f" opacity=".85" />
          <path d="M16 18 L16 11.5" stroke={c} strokeWidth="2.8" strokeLinecap="round" />
          <path d="M16 18 L20.5 20.5" stroke={c} strokeWidth="2.8" strokeLinecap="round" />
          <circle cx="16" cy="18" r="1.8" fill={c} />
        </svg>
      );
    case 'blitz':
      return (
        <svg {...common}>
          <path d="M19.5 2 L6 18.5 H14.5 L11.5 30 L26 12.5 H17.5 Z" fill={c} />
          <path d="M19.5 2 L14.5 14 L17.5 12.5 Z" fill="#fff" opacity=".35" />
          <path d="M11.5 30 L17.5 18.5 H14.5 Z" fill="#000" opacity=".15" />
        </svg>
      );
    case 'bullet':
      return (
        <svg {...common}>
          {/* a speeding bullet with three trail streaks */}
          <g transform="rotate(-35 16 16)">
            <path d="M12 11 H22 C27 11 30 13.5 30 16 C30 18.5 27 21 22 21 H12 Z" fill={c} />
            <rect x="9.5" y="11" width="3.5" height="10" rx="1" fill="#b8860f" />
            <path d="M22 12.4 C25.5 12.6 28 14.2 28.4 16" stroke="#fff" strokeOpacity=".45" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            <rect x="1" y="12" width="6.5" height="2.2" rx="1.1" fill={c} opacity=".75" />
            <rect x="0" y="15" width="8" height="2.2" rx="1.1" fill={c} opacity=".55" />
            <rect x="2" y="18" width="5.5" height="2.2" rx="1.1" fill={c} opacity=".75" />
          </g>
        </svg>
      );
    case 'daily':
      return (
        <svg {...common}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <rect key={a} x="14.6" y="1.5" width="2.8" height="6" rx="1.4" fill={c} transform={`rotate(${a} 16 16)`} />
          ))}
          <circle cx="16" cy="16" r="8" fill={c} />
          <circle cx="13.5" cy="13.5" r="2.4" fill="#fff" opacity=".35" />
        </svg>
      );
    case 'puzzles':
      return (
        <svg {...common}>
          <path
            d="M6 9 H11.5 C11 7.5 11 6 12.5 5 C14.5 3.8 17.5 4.4 17.8 6.8 C18 8 17.5 8.6 17 9 H23 V14.5 C24.5 14 26 14 27 15.5 C28.2 17.5 27.6 20.5 25.2 20.8 C24 21 23.4 20.5 23 20 V27 H17 C17.5 26 17.6 24.8 16.6 24 C14.8 22.6 11.8 23 11.3 25 C11 26 11.3 26.6 11.7 27 H6 Z"
            fill={c}
          />
          <path d="M6 9 H11.5 C11 7.5 11 6 12.5 5 C13 4.7 13.6 4.6 14.2 4.6 C12.6 6 13 7.8 13.6 9 Z" fill="#fff" opacity=".3" />
          <path d="M6 22 V27 H11.7 C11.3 26.6 11 26 11.3 25 C11.6 24 12.4 23.4 13.4 23.2 Z" fill="#000" opacity=".15" />
        </svg>
      );
    case 'coach':
      return (
        <svg {...common}>
          <path d="M3 13 L16 6 L29 13 L16 20 Z" fill={c} />
          <path d="M8 16 V22 C8 24.5 12 26.5 16 26.5 C20 26.5 24 24.5 24 22 V16 L16 20.5 Z" fill="#3a8fb0" />
          <path d="M27 13.5 V21" stroke="#f7c631" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="27" cy="22.5" r="1.8" fill="#f7c631" />
        </svg>
      );
  }
};

export default ModeIcon;
