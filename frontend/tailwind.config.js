/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="dusk"]'],
  theme: {
    extend: {
      colors: {
        theme: {
          page: 'var(--color-page)',
          card: 'var(--color-card)',
          raised: 'var(--color-raised)',
          border: 'var(--color-border)',
          text: 'var(--color-text)',
          muted: 'var(--color-text-muted)',
          accent: 'var(--color-accent)',
          'accent-hover': 'var(--color-accent-hover)',
          'accent-text': 'var(--color-accent-text)',
        },
        eval: {
          white: 'var(--color-eval-white)',
          black: 'var(--color-eval-black)',
          draw: 'var(--color-eval-draw)',
        },
        class: {
          brilliant: '#2bc4b0',
          great: '#6f9bd1',
          book: '#c99a6e',
          best: '#7bb661',
          excellent: '#8cc46a',
          good: '#9fbf86',
          inaccuracy: '#f2c14e',
          mistake: '#f59a4b',
          miss: '#ef7d6e',
          blunder: '#e8483b',
        },
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
        pill: '9999px',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'Inter', 'sans-serif'],
        display: ['Figtree', 'Segoe UI', 'sans-serif'],
        // numbers and notation use the same rounded game font as headings
        mono: ['Figtree', 'ui-monospace', 'monospace'],
      },
      transitionDuration: {
        snappy: '50ms',
        faster: '100ms',
        fast: '150ms',
        standard: '200ms',
        steady: '300ms',
        slow: '400ms',
        crawl: '800ms',
      },
      transitionTimingFunction: {
        default: 'cubic-bezier(0, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
