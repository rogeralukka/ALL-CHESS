import { useState, useEffect, useCallback } from 'react';

export interface UseTypewriterOptions {
  text: string;
  speed?: number; // Characters per second, default 30
  prefersReducedMotion?: boolean;
}

export interface UseTypewriterResult {
  displayedText: string;
  isComplete: boolean;
  skip: () => void;
}

export function useTypewriter({
  text,
  speed = 30,
  prefersReducedMotion = false,
}: UseTypewriterOptions): UseTypewriterResult {
  const [displayedText, setDisplayedText] = useState(() => (prefersReducedMotion ? text : ''));
  const [isComplete, setIsComplete] = useState(() => prefersReducedMotion);

  const skip = useCallback(() => {
    setDisplayedText(text);
    setIsComplete(true);
  }, [text]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    if (!text) {
      setDisplayedText('');
      setIsComplete(true);
      return;
    }

    setDisplayedText('');
    setIsComplete(false);

    let currentLength = 0;
    const intervalMs = Math.max(10, Math.floor(1000 / speed));

    const timer = setInterval(() => {
      currentLength += 1;
      setDisplayedText(text.slice(0, currentLength));

      if (currentLength >= text.length) {
        clearInterval(timer);
        setIsComplete(true);
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [text, speed, prefersReducedMotion]);

  return { displayedText, isComplete, skip };
}
