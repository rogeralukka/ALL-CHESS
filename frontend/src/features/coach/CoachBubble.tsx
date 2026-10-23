import React, { useMemo, useRef, useEffect } from 'react';
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
}

interface CoachBubbleProps {
  messages?: BubbleMessage[]; // Support stacked bubbles (max 3)
  text?: string;
  onSkipTypewriter?: () => void;
  voiceEnabled?: boolean;
  onToggleVoice?: () => void;
  className?: string;
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return String(Math.abs(hash));
}

// Format header text like Chess.com reference (e.g. "Bxf7+ is a blunder" or "c3 is best")
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
}) => {
  const { displayedText, isComplete, skip } = useTypewriter({
    text: msg.text,
    speed: typeCps,
    prefersReducedMotion: isOff,
  });

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

  // Eval chip color styling
  const evalScore = msg.evalScore ?? 0;
  let evalBg = 'bg-neutral-600 text-white';
  if (evalScore > 0.2) {
    evalBg = 'bg-white text-neutral-900 border border-neutral-300 shadow-sm';
  } else if (evalScore < -0.2) {
    evalBg = 'bg-neutral-800 text-white border border-neutral-700';
  }

  const currentText = isOff || isComplete ? msg.text : displayedText;

  return (
    <motion.div
      layout={isFull}
      initial={
        isOff
          ? { opacity: 1 }
          : isReduced
          ? { opacity: 0 }
          : { opacity: 0, y: 6 }
      }
      animate={{ opacity: 1, y: 0 }}
      exit={isOff ? { opacity: 1 } : { opacity: 0, scale: isReduced ? 1 : 0.96 }}
      transition={{ duration: isOff ? 0 : isReduced ? 0.12 : 0.2, ease: [0, 0, 0.2, 1] }}
      onClick={skip}
      className={`p-3.5 rounded-md cursor-pointer select-none transition-shadow ${
        isLatest
          ? 'bg-[var(--coach-bubble-bg)] text-[var(--coach-bubble-text)] shadow-md border border-[var(--coach-bubble-border)]'
          : 'bg-[var(--coach-bubble-bg)]/80 text-[var(--coach-bubble-text)]/75 text-sm scale-[0.98]'
      }`}
    >
      {/* Header row: classification badge + move notation with label + right-aligned eval chip */}
      {(msg.classification || msg.moveSan || msg.evalText) && (
        <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-black/5 dark:border-white/10">
          <div className="flex items-center gap-1.5 min-w-0">
            {msg.classification && (
              <ClassificationBadge classification={msg.classification} size="sm" showLabel={false} />
            )}
            {msg.moveSan && (
              <span className="font-bold text-sm truncate">
                <span className="font-mono text-[15px]">{toFigurineSan(msg.moveSan)}</span>{' '}
                <span className="font-sans font-semibold opacity-90">{getHeaderPhrase(msg.classification)}</span>
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
                className="p-1 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
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

      {/* Message text with typewriter / accessible live region */}
      <div className="text-[15px] leading-relaxed font-normal" aria-live="polite">
        <span className="sr-only">{msg.text}</span>
        <span aria-hidden="true">{currentText}</span>
        {!isComplete && !isOff && (
          <span className="inline-block w-1 h-3.5 ml-0.5 bg-theme-accent animate-pulse" />
        )}
      </div>

      {/* Typewriter Skip Hint */}
      {isLatest && !isComplete && !isOff && (
        <div className="text-xs text-theme-muted/70 text-right mt-1 font-mono">
          Click to skip typing
        </div>
      )}
    </motion.div>
  );
};

export const CoachBubble: React.FC<CoachBubbleProps> = ({
  messages: propMessages,
  text,
  voiceEnabled = false,
  onToggleVoice,
  className = '',
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
          return (
            <SingleBubbleItem
              key={msg.id}
              msg={msg}
              isLatest={isLatest}
              isOff={isOff}
              isReduced={isReduced}
              isFull={isFull}
              typeCps={typeCps}
              voiceEnabled={voiceEnabled}
              hasSpokenSetRef={hasSpokenSetRef}
              onToggleVoice={isLatest ? onToggleVoice : undefined}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default CoachBubble;
