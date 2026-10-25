import React, { useEffect, useId, useState } from 'react';
import { motion } from 'framer-motion';
import { useMotion } from '@/lib/useMotion';

/**
 * The coach as a 2D cut-out puppet drawn in SVG: every part (eyes, lids, brows, mouth, arms,
 * hands) is its own layer, so the coach can blink, talk and gesture without new artwork.
 * Same character as the painted coach: messy black hair, tan skin, black floral shirt.
 */

export type RigFace = 'neutral' | 'happy' | 'smile' | 'grin' | 'thinking' | 'worried' | 'surprised' | 'sleepy';
export type RigGesture = 'none' | 'wave' | 'thumbsup' | 'think' | 'celebrate' | 'shrug' | 'point';

export interface CoachRigProps {
  face?: RigFace;
  gesture?: RigGesture;
  talking?: boolean;
  /** px height of the drawing; width follows the 400:440 frame */
  size?: number;
  /** crop to head + shoulders */
  bust?: boolean;
  className?: string;
}

const SKIN = '#f0b48a';
const SKIN_SHADE = '#d9926a';
const HAIR = '#1c1a1f';
const HAIR_HL = '#3b3843';
const INK = '#2a1a16';
const SHIRT = '#1f2024';
const MOUTH = '#6e1f25';
const SW = 3.2; // ink stroke width

const EYES = [
  { cx: 166, cy: 196 },
  { cx: 234, cy: 196 },
];

/* ------------------------------------------------------------------ hands */
const Hand: React.FC<{ kind: 'open' | 'fist' | 'thumb' | 'point'; x: number; y: number; rot?: number; flip?: boolean }> = ({ kind, x, y, rot = 0, flip }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip ? -1 : 1} 1)`}>
    {kind === 'open' && (
      <>
        {[-15, -5, 5, 15].map((fx, i) => (
          <line key={i} x1={fx * 0.8} y1={-8} x2={fx * 1.15} y2={-34 + Math.abs(i - 1.5) * 3} stroke={INK} strokeWidth={11 + SW} strokeLinecap="round" />
        ))}
        <line x1={18} y1={4} x2={33} y2={-10} stroke={INK} strokeWidth={11 + SW} strokeLinecap="round" />
        <ellipse cx={0} cy={2} rx={20} ry={19} fill={SKIN} stroke={INK} strokeWidth={SW} />
        {[-15, -5, 5, 15].map((fx, i) => (
          <line key={i} x1={fx * 0.8} y1={-8} x2={fx * 1.15} y2={-34 + Math.abs(i - 1.5) * 3} stroke={SKIN} strokeWidth={11} strokeLinecap="round" />
        ))}
        <line x1={18} y1={4} x2={33} y2={-10} stroke={SKIN} strokeWidth={11} strokeLinecap="round" />
        <path d="M -12 10 Q 0 16 12 9" fill="none" stroke={SKIN_SHADE} strokeWidth={2.5} strokeLinecap="round" />
      </>
    )}
    {(kind === 'fist' || kind === 'thumb' || kind === 'point') && (
      <>
        {kind === 'thumb' && (
          <>
            <line x1={-6} y1={-12} x2={-8} y2={-40} stroke={INK} strokeWidth={13 + SW} strokeLinecap="round" />
            <line x1={-6} y1={-12} x2={-8} y2={-40} stroke={SKIN} strokeWidth={13} strokeLinecap="round" />
          </>
        )}
        {kind === 'point' && (
          <>
            <line x1={10} y1={-8} x2={42} y2={-26} stroke={INK} strokeWidth={10 + SW} strokeLinecap="round" />
            <line x1={10} y1={-8} x2={42} y2={-26} stroke={SKIN} strokeWidth={10} strokeLinecap="round" />
          </>
        )}
        <rect x={-19} y={-17} width={38} height={34} rx={14} fill={SKIN} stroke={INK} strokeWidth={SW} />
        {/* curled fingers */}
        {[-7, 1, 9].map((fy) => (
          <path key={fy} d={`M 4 ${fy} L 17 ${fy}`} stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
        ))}
        {kind === 'thumb' && <path d="M -14 -12 Q -6 -8 0 -14" fill="none" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />}
      </>
    )}
  </g>
);

/* ------------------------------------------------------------------ arm: sleeve + forearm drawn as stroked polylines with an ink edge */
const Arm: React.FC<{ pts: [number, number][]; sleeve: number; pattern: string }> = ({ pts, sleeve, pattern }) => {
  const d = pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ');
  // sleeve covers the first `sleeve` fraction of the first segment
  const [a, b] = pts;
  const sx = a[0] + (b[0] - a[0]) * sleeve;
  const sy = a[1] + (b[1] - a[1]) * sleeve;
  return (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth={30 + SW * 2} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={SKIN} strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" />
      <line x1={a[0]} y1={a[1]} x2={sx} y2={sy} stroke={INK} strokeWidth={44 + SW * 2} strokeLinecap="round" />
      <line x1={a[0]} y1={a[1]} x2={sx} y2={sy} stroke={`url(#${pattern})`} strokeWidth={44} strokeLinecap="round" />
    </g>
  );
};

/* ------------------------------------------------------------------ mouths */
const Mouth: React.FC<{ kind: string }> = ({ kind }) => {
  const y = 250;
  switch (kind) {
    case 'grin':
    case 'talk-open':
      return (
        <g>
          <path d={`M 176 ${y - 6} Q 200 ${y - 10} 224 ${y - 6} Q 222 ${y + (kind === 'grin' ? 26 : 20)} 200 ${y + (kind === 'grin' ? 28 : 22)} Q 178 ${y + (kind === 'grin' ? 26 : 20)} 176 ${y - 6} Z`} fill={MOUTH} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
          <path d={`M 181 ${y - 5} Q 200 ${y - 8} 219 ${y - 5} L 217 ${y + 3} Q 200 ${y + 5} 183 ${y + 3} Z`} fill="#fff" />
          <ellipse cx={200} cy={y + 17} rx={11} ry={6} fill="#e8707a" />
        </g>
      );
    case 'talk-mid':
      return <ellipse cx={200} cy={y + 4} rx={13} ry={9} fill={MOUTH} stroke={INK} strokeWidth={SW} />;
    case 'smile':
      return <path d={`M 182 ${y - 2} Q 200 ${y + 14} 218 ${y - 2}`} fill="none" stroke={INK} strokeWidth={SW + 0.6} strokeLinecap="round" />;
    case 'o':
      return <ellipse cx={200} cy={y + 4} rx={8} ry={10} fill={MOUTH} stroke={INK} strokeWidth={SW} />;
    case 'side':
      return <path d={`M 190 ${y + 2} Q 204 ${y + 4} 216 ${y - 4}`} fill="none" stroke={INK} strokeWidth={SW + 0.6} strokeLinecap="round" />;
    case 'wavy':
      return <path d={`M 182 ${y + 2} q 4.5 -6 9 0 t 9 0 t 9 0 t 9 0`} fill="none" stroke={INK} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" />;
    default:
      return <path d={`M 188 ${y + 2} L 212 ${y + 2}`} stroke={INK} strokeWidth={SW + 0.6} strokeLinecap="round" />;
  }
};

/* ------------------------------------------------------------------ face presets */
const FACE: Record<RigFace, { lid: number; brows: [number, number]; browY: number; mouth: string; eye: 'dot' | 'happy'; look?: [number, number]; blush?: boolean }> = {
  neutral: { lid: 0.42, brows: [0, 0], browY: 0, mouth: 'flat', eye: 'dot' },
  sleepy: { lid: 0.6, brows: [-4, 4], browY: 2, mouth: 'flat', eye: 'dot' },
  smile: { lid: 0.12, brows: [4, -4], browY: -3, mouth: 'smile', eye: 'dot' },
  happy: { lid: 0, brows: [8, -8], browY: -6, mouth: 'grin', eye: 'happy' },
  grin: { lid: 0.05, brows: [6, -6], browY: -5, mouth: 'grin', eye: 'dot' },
  thinking: { lid: 0.18, brows: [-12, -4], browY: -2, mouth: 'side', eye: 'dot', look: [5, -5] },
  worried: { lid: 0.1, brows: [14, -14], browY: -2, mouth: 'wavy', eye: 'dot', blush: true },
  surprised: { lid: 0, brows: [6, -6], browY: -10, mouth: 'o', eye: 'dot' },
};

export const CoachRig: React.FC<CoachRigProps> = ({ face = 'neutral', gesture = 'none', talking = false, size = 220, bust = false, className = '' }) => {
  const { isOff, isFull } = useMotion();
  const uid = useId().replace(/:/g, '');
  const pat = `shirt-${uid}`;
  const f = FACE[face];

  // blink: close the lids briefly every few seconds
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    if (isOff) return;
    let t: ReturnType<typeof setTimeout>;
    const loop = () => {
      t = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 110);
        loop();
      }, 2200 + Math.random() * 2800);
    };
    loop();
    return () => clearTimeout(t);
  }, [isOff]);

  // talking: cycle mouth shapes
  const [talkFrame, setTalkFrame] = useState(0);
  useEffect(() => {
    if (!talking || isOff) return;
    const id = setInterval(() => setTalkFrame((n) => (n + 1) % 4), 120);
    return () => clearInterval(id);
  }, [talking, isOff]);
  const mouth = talking && !isOff ? ['talk-open', 'talk-mid', 'flat', 'talk-mid'][talkFrame] : f.mouth;

  const lid = blink ? 1 : f.lid;
  const [lx, ly] = f.look || [0, 0];
  const vb = bust ? '60 40 280 330' : '0 0 400 440';
  const aspect = bust ? 280 / 330 : 400 / 440;

  return (
    <svg
      viewBox={vb}
      width={size * aspect}
      height={size}
      className={className}
      role="img"
      aria-label={`Coach, ${face}${gesture !== 'none' ? `, ${gesture}` : ''}`}
      data-testid="coach-rig"
      data-face={face}
      data-gesture={gesture}
    >
      <defs>
        <pattern id={pat} width="64" height="64" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
          <rect width="64" height="64" fill={SHIRT} />
          {(
            [
              [12, 12, '#f29aa0', 1.25],
              [44, 22, '#f6c84c', 0.9],
              [26, 44, '#6cc4c0', 1.1],
              [54, 54, '#f7b48a', 0.8],
              [4, 50, '#f6c84c', 0.7],
            ] as [number, number, string, number][]
          ).map(([x, y, c, k], i) => (
            <g key={i} transform={`translate(${x} ${y}) scale(${k}) rotate(${i * 37})`}>
              <ellipse cx={-8} cy={-4} rx={6} ry={2.8} fill="#4f8f63" transform="rotate(-30)" />
              <ellipse cx={7} cy={6} rx={5} ry={2.4} fill="#4f8f63" transform="rotate(40)" />
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse key={a} cx={Math.cos((a * Math.PI) / 180) * 4.4} cy={Math.sin((a * Math.PI) / 180) * 4.4} rx={3.6} ry={3} transform={`rotate(${a} ${Math.cos((a * Math.PI) / 180) * 4.4} ${Math.sin((a * Math.PI) / 180) * 4.4})`} fill={c} />
              ))}
              <circle r={2.2} fill={c === '#f6c84c' ? '#e87b4a' : '#ffd45c'} />
            </g>
          ))}
        </pattern>
        {EYES.map((e, i) => (
          <clipPath id={`eye-${uid}-${i}`} key={i}>
            <ellipse cx={e.cx} cy={e.cy} rx={15} ry={18} />
          </clipPath>
        ))}
      </defs>

      <motion.g
        animate={isFull ? { y: [0, -2, 0] } : undefined}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* ---------------- arms behind the body */}
        {gesture === 'shrug' && (
          <>
            <Arm pts={[[120, 350], [80, 395], [58, 352]]} sleeve={0.45} pattern={pat} />
            <Arm pts={[[280, 350], [320, 395], [342, 352]]} sleeve={0.45} pattern={pat} />
            <Hand kind="open" x={56} y={340} rot={-70} />
            <Hand kind="open" x={344} y={340} rot={70} flip />
          </>
        )}

        {/* ---------------- torso */}
        <path d="M 14 440 C 18 372 70 330 140 318 L 172 302 L 228 302 L 260 318 C 330 330 382 372 386 440 Z" fill={`url(#${pat})`} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
        <path d="M 260 318 C 330 330 382 372 386 440 L 330 440 C 330 390 300 350 252 330 Z" fill="#000" opacity={0.22} />
        {/* neck + V opening */}
        <path d="M 176 262 L 176 306 L 200 344 L 224 306 L 224 262 Z" fill={SKIN} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
        <path d="M 176 262 Q 200 290 224 262 L 224 280 Q 200 300 176 280 Z" fill={SKIN_SHADE} opacity={0.7} />
        {/* collar */}
        <path d="M 172 304 L 152 330 L 186 338 L 200 344 Z" fill={`url(#${pat})`} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
        <path d="M 228 304 L 248 330 L 214 338 L 200 344 Z" fill={`url(#${pat})`} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />

        {/* ---------------- head */}
        <motion.g
          animate={
            isOff
              ? undefined
              : talking
                ? { rotate: [0, -1.5, 0.6, 0], y: [0, -1.5, 0, 0] }
                : gesture === 'think'
                  ? { rotate: -5 }
                  : gesture === 'shrug'
                    ? { rotate: 5 }
                    : { rotate: 0 }
          }
          transition={talking ? { duration: 0.8, repeat: Infinity } : { type: 'spring', stiffness: 160, damping: 14 }}
          style={{ originX: '200px', originY: '270px' }}
        >
          {/* ears */}
          <ellipse cx={110} cy={196} rx={17} ry={25} fill={SKIN} stroke={INK} strokeWidth={SW} />
          <ellipse cx={290} cy={196} rx={17} ry={25} fill={SKIN} stroke={INK} strokeWidth={SW} />
          <path d="M 104 188 Q 110 196 106 206" fill="none" stroke={SKIN_SHADE} strokeWidth={3} strokeLinecap="round" />
          <path d="M 296 188 Q 290 196 294 206" fill="none" stroke={SKIN_SHADE} strokeWidth={3} strokeLinecap="round" />
          {/* back hair volume, wider than the head */}
          <path d="M 98 200 C 82 160 90 104 122 80 L 108 60 L 138 66 C 150 40 178 30 200 36 L 212 18 L 222 40 C 248 36 276 48 288 70 L 312 66 L 300 92 C 318 120 316 166 302 202 L 296 178 L 292 200 Z" fill={HAIR} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
          {/* face */}
          <path d="M 112 172 C 112 104 152 80 200 80 C 248 80 288 104 288 172 C 288 234 260 276 200 280 C 140 276 112 234 112 172 Z" fill={SKIN} stroke={INK} strokeWidth={SW} />
          {/* cel shadow on the right cheek and jaw */}
          <path d="M 262 120 C 288 150 290 220 262 254 C 248 270 226 278 200 280 C 240 262 262 220 262 170 Z" fill={SKIN_SHADE} opacity={0.55} />
          {/* soft shadow the fringe casts on the forehead */}
          <path d="M 122 150 L 140 132 L 152 150 L 164 128 L 178 148 L 192 124 L 208 146 L 224 126 L 238 150 L 250 128 L 264 150 L 272 136 C 280 146 284 156 285 166 C 250 158 160 156 116 168 Z" fill={SKIN_SHADE} opacity={0.45} />
          {f.blush && (
            <>
              <ellipse cx={146} cy={228} rx={16} ry={8} fill="#f07f85" opacity={0.55} />
              <ellipse cx={254} cy={228} rx={16} ry={8} fill="#f07f85" opacity={0.55} />
            </>
          )}
          {/* eyes */}
          {EYES.map((e, i) =>
            f.eye === 'happy' && !blink ? (
              <path key={i} d={`M ${e.cx - 14} ${e.cy + 4} Q ${e.cx} ${e.cy - 14} ${e.cx + 14} ${e.cy + 4}`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
            ) : (
              <g key={i}>
                <g clipPath={`url(#eye-${uid}-${i})`}>
                  <ellipse cx={e.cx + lx} cy={e.cy + ly} rx={14} ry={17} fill={INK} />
                  <circle cx={e.cx + lx + 5} cy={e.cy + ly - 6} r={4.5} fill="#fff" />
                  <circle cx={e.cx + lx - 4} cy={e.cy + ly + 6} r={2} fill="#fff" opacity={0.7} />
                  {/* upper lid slides down: 0 open, 1 closed */}
                  <motion.rect
                    x={e.cx - 18}
                    y={e.cy - 20}
                    width={36}
                    initial={false}
                    animate={{ height: lid * 38 }}
                    transition={{ duration: blink ? 0.06 : 0.18 }}
                    fill={SKIN}
                  />
                </g>
                <path d={`M ${e.cx + (i ? 15 : -15)} ${e.cy - 12} l ${i ? 6 : -6} -5`} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
                {/* lash line follows the lid */}
                <motion.path
                  initial={false}
                  animate={{ d: `M ${e.cx - 17} ${e.cy - 18 + lid * 38} Q ${e.cx} ${e.cy - 22 + lid * 38} ${e.cx + 17} ${e.cy - 18 + lid * 38}` }}
                  transition={{ duration: blink ? 0.06 : 0.18 }}
                  fill="none"
                  stroke={INK}
                  strokeWidth={4}
                  strokeLinecap="round"
                />
              </g>
            ),
          )}
          {/* brows */}
          {EYES.map((e, i) => (
            <motion.rect
              key={i}
              x={e.cx - 19}
              y={e.cy - 38 + f.browY}
              width={38}
              height={9}
              rx={4.5}
              fill={HAIR}
              initial={false}
              animate={{ rotate: f.brows[i], y: f.browY - (talking ? [0, -2, 0][talkFrame % 3] : 0) }}
              style={{ originX: `${e.cx}px`, originY: `${e.cy - 34}px` }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            />
          ))}
          {/* nose */}
          <path d="M 198 210 Q 192 226 202 228" fill="none" stroke={SKIN_SHADE} strokeWidth={3.5} strokeLinecap="round" />
          {/* mouth */}
          <Mouth kind={mouth} />
          {/* hair */}
          <path
            d="M 104 192 C 96 150 100 112 124 90 L 116 70 L 140 78 C 146 58 166 48 186 52 L 190 32 L 206 50 C 226 42 250 46 264 62 L 286 54 L 280 82 C 300 100 306 138 296 192 L 288 162 C 286 144 280 132 270 126 L 264 144 L 250 120 L 238 142 L 224 118 L 208 140 L 192 116 L 178 140 L 164 120 L 152 144 L 140 126 C 128 134 118 154 114 176 Z"
            fill={HAIR}
            stroke={INK}
            strokeWidth={SW}
            strokeLinejoin="round"
          />
          {/* loose spikes and side tufts over the ears */}
          <path d="M 120 96 L 92 96 L 112 112 Z M 280 96 L 308 92 L 290 112 Z M 168 52 L 156 26 L 182 46 Z M 236 50 L 252 24 L 256 52 Z M 104 170 L 90 188 L 112 186 Z M 296 170 L 310 188 L 288 186 Z" fill={HAIR} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
          <path d="M 150 76 Q 176 62 206 66" fill="none" stroke={HAIR_HL} strokeWidth={6} strokeLinecap="round" />
          <path d="M 128 100 Q 140 92 152 92" fill="none" stroke={HAIR_HL} strokeWidth={4} strokeLinecap="round" />
          <path d="M 236 70 Q 258 76 272 92" fill="none" stroke={HAIR_HL} strokeWidth={5} strokeLinecap="round" />
          {f.mouth === 'side' && gesture !== 'think' && null}
        </motion.g>

        {/* ---------------- arms in front */}
        {gesture === 'wave' && (
          <>
            <Arm pts={[[126, 336], [88, 290], [92, 220]]} sleeve={0.5} pattern={pat} />
            <motion.g
              animate={isOff ? undefined : { rotate: [0, 16, -6, 16, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.4 }}
              style={{ originX: '92px', originY: '222px' }}
            >
              <Hand kind="open" x={92} y={198} rot={-8} />
            </motion.g>
          </>
        )}
        {gesture === 'thumbsup' && (
          <>
            <Arm pts={[[282, 340], [318, 400], [282, 372]]} sleeve={0.42} pattern={pat} />
            <motion.g animate={isOff ? undefined : { y: [0, -4, 0] }} transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}>
              <Hand kind="thumb" x={272} y={360} />
            </motion.g>
          </>
        )}
        {gesture === 'think' && (
          <>
            <Arm pts={[[150, 360], [196, 400], [232, 300]]} sleeve={0.35} pattern={pat} />
            <Hand kind="fist" x={232} y={286} rot={-10} />
          </>
        )}
        {gesture === 'celebrate' && (
          <motion.g animate={isOff ? undefined : { y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}>
            <Arm pts={[[124, 336], [70, 270], [72, 190]]} sleeve={0.45} pattern={pat} />
            <Arm pts={[[276, 336], [330, 270], [328, 190]]} sleeve={0.45} pattern={pat} />
            <Hand kind="fist" x={72} y={176} />
            <Hand kind="fist" x={328} y={176} flip />
          </motion.g>
        )}
        {gesture === 'point' && (
          <>
            <Arm pts={[[282, 340], [336, 360], [356, 318]]} sleeve={0.45} pattern={pat} />
            <Hand kind="point" x={356} y={306} rot={-20} />
          </>
        )}
      </motion.g>
    </svg>
  );
};

/** Maps the app's coach expressions onto a face + gesture pair. */
export const RIG_FOR_EXPRESSION: Record<string, { face: RigFace; gesture: RigGesture }> = {
  neutral: { face: 'neutral', gesture: 'none' },
  wave: { face: 'happy', gesture: 'wave' },
  thumbsup: { face: 'smile', gesture: 'thumbsup' },
  thinking: { face: 'thinking', gesture: 'think' },
  brilliant: { face: 'happy', gesture: 'celebrate' },
  embarrassed: { face: 'worried', gesture: 'shrug' },
};

export default CoachRig;
