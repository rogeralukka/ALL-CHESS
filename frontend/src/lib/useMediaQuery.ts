import { useEffect, useState } from 'react';

/** Tracks a CSS media query. Falls back to `false` where matchMedia is missing (SSR, odd test setups). */
export function useMediaQuery(query: string): boolean {
  const get = () => (typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia(query).matches : false);
  const [matches, setMatches] = useState<boolean>(get);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, [query]);

  return matches;
}

/** Phones and small tablets: below Tailwind's `lg` breakpoint, where the app switches to its phone layout. */
export const PHONE_QUERY = '(max-width: 1023px)';
export const usePhoneLayout = () => useMediaQuery(PHONE_QUERY);
