import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}', './public/**/*.svg'],
  theme: {
    container: { center: true, padding: '1rem' },

    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',

        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },

        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        electric: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#b1d4ff',
          300: '#82b8ff',
          400: '#4391ff',
          500: '#1e6eff',
          600: '#0b54ff',
          700: '#063ed2',
          800: '#062f9f',
          900: '#07246f',
        },
        midnight: {
          50: '#f6f7fb',
          100: '#e9ebf3',
          200: '#c8cdde',
          300: '#a3a9c6',
          400: '#7b83ae',
          500: '#5c6595',
          600: '#474f78',
          700: '#343a5b',
          800: '#23283d',
          900: '#151824',
        },

        // brand palette from prompt
        'brand-blue': '#2563eb',
        'brand-green': '#22c55e',
        'brand-slate': '#0f172a',
        'brand-sky': '#e0f2fe',
      },

      maxWidth: {
        content: '1240px', // from prompt
      },

      fontFamily: {
        sans: ['var(--font-geist-sans)', 'InterVariable', ...fontFamily.sans],
        display: ['var(--font-merriweather)', ...fontFamily.serif],
        mono: ['var(--font-geist-mono)', ...fontFamily.mono],
      },

      borderRadius: {
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
      },

      boxShadow: {
        soft: '0 4px 20px rgba(0,0,0,0.06)',
        glass: '0 8px 32px rgba(0,0,0,0.12)',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(.16,1,.3,1)',
      },

      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        'scale-in': 'scale-in .25s cubic-bezier(.16,1,.3,1) both',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            h1: {
              fontSize: '1.75rem',
              fontWeight: '700',
              letterSpacing: '-0.025em',
            },
            h2: { fontSize: '1.5rem', fontWeight: '600' },
            h3: { fontSize: '1.25rem', fontWeight: '500' },
            table: { width: '100%' },
            'table th': {
              borderBottom: '2px solid hsl(var(--border))',
              padding: '0.75rem',
            },
            'table td': {
              borderBottom: '1px solid hsl(var(--border))',
              padding: '0.75rem',
            },
            'code, kbd, samp': { backgroundColor: 'hsl(var(--muted))' },
            'p code': { borderBottom: '1px dashed hsl(var(--border))' },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            a: {
              color: 'hsl(var(--primary))',
              '&:hover': {
                color: 'hsl(var(--primary) / 0.8)',
              },
            },
          },
        },
      },
    },
  },

  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    require('tailwindcss-rtl'),
    plugin(({ addVariant, addUtilities }) => {
      addVariant('hocus', ['&:hover', '&:focus-visible']);
      
      // Add logical properties for RTL support
      addUtilities({
        '.ms-auto': {
          'margin-inline-start': 'auto',
        },
        '.me-auto': {
          'margin-inline-end': 'auto',
        },
        '.ps-2': {
          'padding-inline-start': '0.5rem',
        },
        '.ps-3': {
          'padding-inline-start': '0.75rem',
        },
        '.ps-4': {
          'padding-inline-start': '1rem',
        },
        '.pe-2': {
          'padding-inline-end': '0.5rem',
        },
        '.pe-3': {
          'padding-inline-end': '0.75rem',
        },
        '.pe-4': {
          'padding-inline-end': '1rem',
        },
        '.border-s': {
          'border-inline-start-width': '1px',
        },
        '.border-e': {
          'border-inline-end-width': '1px',
        },
        '.text-start': {
          'text-align': 'start',
        },
        '.text-end': {
          'text-align': 'end',
        },
        '.rounded-s': {
          'border-start-start-radius': '0.25rem',
          'border-end-start-radius': '0.25rem',
        },
        '.rounded-e': {
          'border-start-end-radius': '0.25rem',
          'border-end-end-radius': '0.25rem',
        },
      });
    }),
  ],
};

export default config;
