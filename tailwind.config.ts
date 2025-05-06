import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'
import plugin from 'tailwindcss/plugin'

/** @type {import('tailwindcss').Config} */
const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx}',
    './public/**/*.svg',
  ],
  theme: {
    container: { center: true, padding: '1rem' },

    /* ------------------------------------------------------------------
       ①  ALL design tokens now map to the CSS‑variable system you defined
          in globals.css  →  “hsl(var(--primary))” etc.
       ------------------------------------------------------------------ */
    extend: {
      colors: {
        /* semantic palette (light *and* dark handled by CSS vars) */
        background:           'hsl(var(--background))',
        foreground:           'hsl(var(--foreground))',
        card:                 'hsl(var(--card))',
        'card-foreground':    'hsl(var(--card-foreground))',
        popover:              'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',

        primary:   { DEFAULT: 'hsl(var(--primary))',   foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        accent:    { DEFAULT: 'hsl(var(--accent))',    foreground: 'hsl(var(--accent-foreground))' },
        muted:     { DEFAULT: 'hsl(var(--muted))',     foreground: 'hsl(var(--muted-foreground))' },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },

        border: 'hsl(var(--border))',
        input : 'hsl(var(--input))',
        ring  : 'hsl(var(--ring))',

        /* brand gradients you were already using */
        electric: {
          50:'#f0f7ff',100:'#e0efff',200:'#b1d4ff',300:'#82b8ff',400:'#4391ff',
          500:'#1e6eff',600:'#0b54ff',700:'#063ed2',800:'#062f9f',900:'#07246f',
        },
        midnight: {
          50:'#f6f7fb',100:'#e9ebf3',200:'#c8cdde',300:'#a3a9c6',400:'#7b83ae',
          500:'#5c6595',600:'#474f78',700:'#343a5b',800:'#23283d',900:'#151824',
        },
      },

      /* typography */
      fontFamily: {
        sans   : ['InterVariable', ...fontFamily.sans],
        display: ['Poppins',        ...fontFamily.sans],
      },

      /* radius pulled from --radius for consistency */
      borderRadius: {
        lg : 'var(--radius)',
        xl : '1.25rem',
        '2xl': '1.5rem',
      },

      /* subtle shadows & easing */
      boxShadow: {
        soft : '0 4px 20px rgba(0,0,0,0.06)',
        glass: '0 8px 32px rgba(0,0,0,0.12)',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(.16,1,.3,1)',
      },

      /* tiny animation helpers (used by Sheet / Mini‑Cart) */
      keyframes: {
        'fade-in':   { '0%':{opacity:0,transform:'translateY(6px)'}, '100%':{opacity:1,transform:'translateY(0)'} },
        'scale-in':  { '0%':{opacity:0,transform:'scale(.95)'},      '100%':{opacity:1,transform:'scale(1)'} },
      },
      animation: {
        'fade-in' : 'fade-in 0.4s ease-out both',
        'scale-in': 'scale-in .25s cubic-bezier(.16,1,.3,1) both',
      },
    },
  },

  /* ------------------------------------------------------------------
     ②  Plugins – tailwindcss‑animate gives us enter/leave keyframes.
         The tiny “hocus:” variant is handy for consistent hover/focus.
     ------------------------------------------------------------------ */
  plugins: [
    require('tailwindcss-animate'),
    plugin(({ addVariant }) => {
      addVariant('hocus', ['&:hover', '&:focus-visible'])
    }),
  ],
}

export default config
