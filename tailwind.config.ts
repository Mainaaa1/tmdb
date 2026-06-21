import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        ink: {
          950: '#060814',
          900: '#0A1020',
          800: '#121A33',
          700: '#1C2647',
        },
        gold: {
          50: '#FFF9E8',
          100: '#FFF1C2',
          200: '#FFE48B',
          300: '#FFD34A',
          400: '#FFBE1A',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255, 190, 26, 0.18), 0 18px 60px rgba(7, 12, 26, 0.45)',
      },
      backgroundImage: {
        'filamu-noise':
          'radial-gradient(circle at top left, rgba(255, 190, 26, 0.16), transparent 32%), radial-gradient(circle at top right, rgba(99, 102, 241, 0.12), transparent 28%), linear-gradient(180deg, rgba(10, 16, 32, 0.92), rgba(6, 8, 20, 0.98))',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.4s infinite',
        floaty: 'floaty 6s ease-in-out infinite',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
};

export default config;
