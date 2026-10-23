import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoveClassification } from '@/data/types';
import { ClassificationBadge } from '@/components/ClassificationBadge';
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

export const CoachBubble: React.FC<CoachBubbleProps> = ({
  messages: propMessages,
  text,
  voiceEnabled = false,
  onToggleVoice,
  className = '',
}) => {
  const messages = propMessages || (text ? [{ id: 'single', text }] : []);
  const [displayedTextMap, setDisplayedTextMap] = useState<Record<string, string>>({});
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Handle typewriter for the latest message
  const activeMessage = messages[messages.length - 1];

  useEffect(() => {
    if (!activeMessage) return;

    // Speak if voice is enabled and synthesis is available
    if (voiceEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activeMessage.text);
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }

    if (reduceMotion) {
      setDisplayedTextMap((prev) => ({ ...prev, [activeMessage.id]: activeMessage.text }));
      setCompletedMap((prev) => ({ ...prev, [activeMessage.id]: true }));
      return;
    }

    let currentIndex = 0;
    const fullText = activeMessage.text;
    const interval = 1000 / 30; // ~30 chars per second

    const timer = setInterval(() => {
      currentIndex += 1;
      setDisplayedTextMap((prev) => ({
        ...prev,
        [activeMessage.id]: fullText.slice(0, currentIndex),
      }));

      if (currentIndex >= fullText.length) {
        clearInterval(timer);
        setCompletedMap((prev) => ({ ...prev, [activeMessage.id]: true }));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [activeMessage, reduceMotion, voiceEnabled]);

  const handleSkip = (msgId: string, fullText: string) => {
    setDisplayedTextMap((prev) => ({ ...prev, [msgId]: fullText }));
    setCompletedMap((prev) => ({ ...prev, [msgId]: true }));
  };

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

  // Stack up to 3 messages
  const visibleMessages = messages.slice(-3);

  return (
    <div className={`flex flex-col gap-2.5 w-full ${className}`}>
      <AnimatePresence initial={false}>
        {visibleMessages.map((msg, index) => {
          const isLatest = index === visibleMessages.length - 1;
          const isCompleted = completedMap[msg.id] || reduceMotion;
          const currentText = isCompleted ? msg.text : displayedTextMap[msg.id] || '';

          // Eval chip color styling
          const evalScore = msg.evalScore ?? 0;
          let evalBg = 'bg-neutral-600 text-white';
          if (evalScore > 0.2) {
            evalBg = 'bg-white text-neutral-900 border border-neutral-300 shadow-sm';
          } else if (evalScore < -0.2) {
            evalBg = 'bg-neutral-800 text-white border border-neutral-700';
          }

          return (
            <motion.div
              key={msg.id}
              initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
              onClick={() => handleSkip(msg.id, msg.text)}
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
                        <span className="font-mono">{msg.moveSan}</span>{' '}
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
              <div
                className="text-[15px] leading-relaxed font-normal"
                aria-live="polite"
              >
                {/* Full text hidden visually for screen readers if currently typing */}
                <span className="sr-only">{msg.text}</span>
                <span aria-hidden="true">{currentText}</span>
                {!isCompleted && !reduceMotion && (
                  <span className="inline-block w-1 h-3.5 ml-0.5 bg-theme-accent animate-pulse" />
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
