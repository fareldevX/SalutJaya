const c = (name) => `rgb(var(--${name}) / <alpha-value>)`

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        snow: c('snow'),
        mist: c('mist'),
        ink: c('ink'),
        'ink-soft': c('ink-soft'),
        emerald: {
          50: c('emerald-50'),
          100: c('emerald-100'),
          300: c('emerald-300'),
          400: c('emerald-400'),
          500: c('emerald-500'),
          600: c('emerald-600'),
          700: c('emerald-700'),
        },
        sky: { 400: c('sky'), 500: c('sky-strong') },
        teal: { 500: c('teal') },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans Variable"', 'system-ui', 'sans-serif'],
        body: ['"Inter Variable"', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        // Skala makro: baris = [ukuran, { lineHeight, letterSpacing, fontWeight }]
        mega: ['var(--fs-mega)', { lineHeight: '0.9', letterSpacing: '-0.045em', fontWeight: '800' }],
        h1: ['var(--fs-h1)', { lineHeight: '0.95', letterSpacing: '-0.04em', fontWeight: '800' }],
        h2: ['var(--fs-h2)', { lineHeight: '0.98', letterSpacing: '-0.035em', fontWeight: '800' }],
        h3: ['var(--fs-h3)', { lineHeight: '1.05', letterSpacing: '-0.025em', fontWeight: '700' }],
        lead: ['var(--fs-lead)', { lineHeight: '1.6' }],
        body: ['var(--fs-body)', { lineHeight: '1.7' }],
      },
      borderRadius: { tile: '1.75rem', panel: '1rem', chip: '0.625rem' },
      transitionTimingFunction: { 'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)' },
      keyframes: { shimmer: { '100%': { transform: 'translateX(100%)' } } },
      animation: { shimmer: 'shimmer 1.6s infinite' },
    },
  },
  plugins: [],
}
