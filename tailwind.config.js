const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Capacity.so inspired color palette
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // Primary
          600: '#0d9488', // Hover
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Accent
          600: '#ea580c', // Hover accent
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Dark theme colors
        dark: {
          bg: '#0a0a0b',      // Main background
          card: '#1a1a1d',    // Card background
          border: '#27272a',  // Borders
          hover: '#2a2a2d',   // Hover states
        },
        // Keep existing primary for backwards compatibility
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
      animation: {
        aurora: "aurora 60s linear infinite",
        'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
        'glow-pulse': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 20px rgba(20, 184, 166, 0.5)',
          },
          '50%': {
            opacity: '.8',
            boxShadow: '0 0 30px rgba(20, 184, 166, 0.8)',
          },
        },
      },
      boxShadow: {
        'glow-teal': '0 0 20px rgba(20, 184, 166, 0.3)',
        'glow-orange': '0 0 20px rgba(249, 115, 22, 0.3)',
      },
    },
  },
  plugins: [addVariablesForColors],
};

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}