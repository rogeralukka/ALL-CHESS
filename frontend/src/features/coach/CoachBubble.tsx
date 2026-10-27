import React, { useMemo, useRef, useEffect, useLayoutEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoveClassification } from '@/data/types';
import { ClassificationBadge } from '@/components/ClassificationBadge';
import { useMotion } from '@/lib/useMotion';
import { useTypewriter } from '@/lib/useTypewriter';
import { toFigurineSan } from '@/lib/formatters';
import { Volume2, VolumeX } from 'lucide-react';

export interface BubbleMessage {
  id: string;
  text: string;
  classification?: MoveClassification;
  moveSan?: string;
  evalText?: string;
  evalScore?: number;
  /** Plain header text (e.g. "White to move", "Solved", "Incorrect"); used instead of "<move> is <label>". */
  title?: string;
  /** Header icon for a plain title. Defaults: classification badge if set, otherwise none. */
  icon?: 'white-to-move' | 'black-to-move' | 'solved' | 'incorrect';
}

interface CoachBubbleProps {
  messages?: BubbleMessage[]; // Support stacked bubbles (max 3)
  text?: string;
  onSkipTypewriter?: () => void;
  voiceEnabled?: boolean;
  onToggleVoice?: () => void;
  className?: string;
  /** Draw a speech tail on the first bubble pointing left, at this many px from the bubble's top. */
  tailTop?: number;
  /** Increment to finish typing immediately (e.g. when the coach portrait is clicked). */
  skipSignal?: number;
  /** Reports whether the newest bubble is still typing (drives the coach's talking motion). */
  onTypingChange?: (typing: boolean) => void;
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return String(Math.abs(hash));
}

// "Bxf7+ is a blunder", "c3 is best"
const getHeaderPhrase = (cls?: MoveClassification) => {
  if (!cls) return '';
  switch (cls) {
    case 'blunder': return 'is a blunder';
    case 'mistake': return 'is a mistake';
    case 'inaccuracy': return 'is an inaccuracy';
    case 'miss': return 'is a miss';
    case 'best': return 'is best';
    case 'brilliant': return 'is brilliant';
    case 'great': return 'is a great move';
    case 'excellent': return 'is an excellent move';
    case 'good': return 'is a good move';
    case 'book': return 'is a book move';
    default: return '';
  }
};

/** Our own speech-tail shape: a short curved swoosh pointing left. */
const BubbleTail: React.FC<{ top: number }> = ({ top }) => (
  <svg
    aria-hidden="true"
    width="14"
    height="22"
    viewBox="0 0 14 22"
    className="absolute pointer-events-none"
    style={{ left: -13, top }}
  >
    <path d="M14 1 C12.6 7.5 8.4 12 0 13.6 C5.6 15.4 10.4 17.8 14 21 Z" fill="var(--coach-bubble-bg)" />
  </svg>
);

const HeaderIcon: React.FC<{ icon: NonNullable<BubbleMessage['icon']> }> = ({ icon }) => {
  if (icon === 'white-to-move' || icon === 'black-to-move') {
    return (
      <span
        aria-hidden="true"
        className="inline-block flex-shrink-0 rounded-[5px]"
        style={{
          width: 22,
          height: 22,
          background: icon === 'white-to-move' ? '#ffffff' : '#312e2b',
          border: '2px solid #8b8987',
        }}
      />
    );
  }
  const solved = icon === 'solved';
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 22 22" className="flex-shrink-0">
      <circle cx="11" cy="11" r="11" fill={solved ? 'var(--class-best)' : 'var(--class-blunder)'} />
      {solved ? (
        <path d="M6.2 11.4l3.1 3.1 6.5-6.6" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M7.4 7.4l7.2 7.2M14.6 7.4l-7.2 7.2" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      )}
    </svg>
  );
};

interface SingleBubbleItemProps {
  msg: BubbleMessage;
  isLatest: boolean;
  isOff: boolean;
  isReduced: boolean;
  isFull: boolean;
  typeCps: number;
  voiceEnabled: boolean;
  hasSpokenSetRef: React.MutableRefObject<Set<string>>;
  onToggleVoice?: () => void;
  /** true when this bubble is part of a stack of 2+; enables layout animation for the stack */
  stacked?: boolean;
  tailTop?: number;
  skipSignal?: number;
  onTypingChange?: (typing: boolean) => void;
}

const SingleBubbleItem: React.FC<SingleBubbleItemProps> = ({
  msg,
  isLatest,
  isOff,
  isReduced,
  isFull,
  typeCps,
  voiceEnabled,
  hasSpokenSetRef,
  onToggleVoice,
  stacked = false,
  tailTop,
  skipSignal,
  onTypingChange,
}) => {
  const { displayedText, isComplete, skip } = useTypewriter({
    text: msg.text,
    speed: typeCps,
    prefersReducedMotion: isOff,
  });

  // Portrait click (or any parent) asks to finish typing
  const lastSkip = useRef(skipSignal);
  useEffect(() => {
    if (skipSignal !== lastSkip.current) {
      lastSkip.current = skipSignal;
      skip();
    }
  }, [skipSignal, skip]);

  useEffect(() => {
    if (isLatest) onTypingChange?.(!isComplete);
  }, [isLatest, isComplete, onTypingChange]);

  // Speak only once per message id
  useEffect(() => {
    if (!isLatest || !voiceEnabled || hasSpokenSetRef.current.has(msg.id)) return;
    if ('speechSynthesis' in window) {
      hasSpokenSetRef.current.add(msg.id);
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(msg.text);
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  }, [isLatest, voiceEnabled, msg.id, msg.text, hasSpokenSetRef]);

  // Smoothly follow the content's height when the message changes (the bubble is sized to the
  // final text from the first frame, so it only resizes once per message, never while typing).
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | 'auto'>('auto');
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight));
    ro.observe(el);
    setHeight(el.offsetHeight);
    return () => ro.disconnect();
  }, []);

  const evalScore = msg.evalScore ?? 0;
  let evalBg = 'bg-neutral-600 text-white';
  if (evalScore > 0.2) {
    evalBg = 'bg-white text-neutral-900 border border-neutral-300 shadow-sm';
  } else if (evalScore < -0.2) {
    evalBg = 'bg-neutral-800 text-white border border-neutral-700';
  }

  const typed = isOff || isComplete ? msg.text : displayedText;
  const rest = msg.text.slice(typed.length);
  const hasHeader = !!(msg.classification || msg.moveSan || msg.evalText || msg.title);

  return (
    <motion.div
      layout={isFull && stacked ? 'position' : false}
      initial={isOff ? { opacity: 1 } : isReduced ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={isOff ? { opacity: 1 } : { opacity: 0, scale: isReduced ? 1 : 0.96 }}
      transition={{ duration: isOff ? 0 : isReduced ? 0.12 : 0.2, ease: [0, 0, 0.2, 1] }}
      onClick={skip}
      data-testid="coach-bubble"
      className={`relative cursor-pointer select-none rounded-[10px] bg-[var(--coach-bubble-bg)] text-[var(--coach-bubble-text)] ${
        isLatest ? '' : 'opacity-60'
      }`}
      style={{ filter: 'drop-shadow(0 1px 1.5px rgba(0,0,0,0.14))', transformOrigin: 'left top' }}
    >
      {tailTop !== undefined && <BubbleTail top={tailTop} />}
      <motion.div
        className="overflow-hidden"
        initial={false}
        animate={{ height }}
        transition={{ duration: isFull ? 0.18 : 0, ease: [0, 0, 0.2, 1] }}
      >
        <div ref={innerRef} className="px-4 py-3">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={msg.id}
              initial={isOff ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.08 } }}
              transition={{ duration: isOff ? 0 : 0.12 }}
            >
              {hasHeader && (
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    {msg.icon ? (
                      <HeaderIcon icon={msg.icon} />
                    ) : (
                      msg.classification && <ClassificationBadge classification={msg.classification} size="md" showLabel={false} />
                    )}
                    {msg.title && !msg.moveSan && (
                      <span className="font-semibold text-[15px] leading-5">{msg.title}</span>
                    )}
                    {msg.moveSan && (
                      <span className="font-semibold text-[15px] leading-5 truncate">
                        <span className="font-bold">{toFigurineSan(msg.moveSan)}</span>{' '}
                        <span>{getHeaderPhrase(msg.classification)}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {onToggleVoice && isLatest && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleVoice();
                        }}
                        className="p-1 rounded text-neutral-500 hover:text-neutral-900 transition-colors"
                        title={voiceEnabled ? 'Mute coach speech' : 'Enable coach speech'}
                        aria-label={voiceEnabled ? 'Mute coach speech' : 'Enable coach speech'}
                      >
                        {voiceEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                      </button>
                    )}
                    {msg.evalText && (
                      <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono tracking-tight ${evalBg}`}>
                        {msg.evalText}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Text: the untyped remainder is laid out but invisible, so the bubble has its final
                  size from the first frame and nothing below it jumps while the coach "types". */}
              <div data-testid="coach-bubble-text" className="text-[16px] leading-6 font-medium" aria-live="polite">
                <span className="sr-only">{msg.text}</span>
                <span aria-hidden="true">{typed}</span>
                {rest && (
                  <span aria-hidden="true" style={{ visibility: 'hidden' }}>
                    {rest}
                  </span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const CoachBubble: React.FC<CoachBubbleProps> = ({
  messages: propMessages,
  text,
  voiceEnabled = false,
  onToggleVoice,
  className = '',
  tailTop,
  skipSignal,
  onTypingChange,
}) => {
  const { typeCps, isFull, isReduced, isOff } = useMotion();
  const hasSpokenSetRef = useRef<Set<string>>(new Set());

  // Memoise messages to prevent restarting typing on parent re-renders
  const messages = useMemo(() => {
    if (propMessages && propMessages.length > 0) return propMessages;
    if (text) {
      return [{ id: `text-${hashString(text)}`, text }];
    }
    return [];
  }, [propMessages, text]);

  // Stack up to 3 messages
  const visibleMessages = messages.slice(-3);

  return (
    <div className={`flex flex-col gap-2.5 w-full ${className}`}>
      <AnimatePresence initial={false}>
        {visibleMessages.map((msg, index) => {
          const isLatest = index === visibleMessages.length - 1;
          const isSingle = visibleMessages.length === 1;
          return (
            <SingleBubbleItem
              // A lone bubble (review, puzzles) updates in place: swapping elements made the old and
              // new bubbles overlap the content below for ~200ms while they animated.
              key={isSingle ? 'single-bubble' : msg.id}
              stacked={!isSingle}
              msg={msg}
              isLatest={isLatest}
              isOff={isOff}
              isReduced={isReduced}
              isFull={isFull}
              typeCps={typeCps}
              voiceEnabled={voiceEnabled}
              hasSpokenSetRef={hasSpokenSetRef}
              onToggleVoice={isLatest ? onToggleVoice : undefined}
              tailTop={index === 0 ? tailTop : undefined}
              skipSignal={skipSignal}
              onTypingChange={onTypingChange}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default CoachBubble;
