import type { Config } from 'tailwindcss'
import { tokens } from './src/lib/design/tokens'

// Generate CSS variables from design tokens
const cssVariables = (() => {
  const vars: Record<string, string> = {}
  
  // Base colors
  Object.entries(tokens.colors.base).forEach(([key, value]) => {
    vars[`--color-base-${key}`] = value
  })
  
  // Brand colors
  Object.entries(tokens.colors.brand).forEach(([brand, shades]) => {
    Object.entries(shades).forEach(([shade, value]) => {
      vars[`--color-${brand}-${shade}`] = value
    })
  })
  
  // Semantic colors
  Object.entries(tokens.colors.semantic).forEach(([key, value]) => {
    vars[`--color-semantic-${key}`] = value
  })
  
  // Spacing
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    vars[`--spacing-${key}`] = value
  })
  
  // Border radius
  Object.entries(tokens.borders.radius).forEach(([key, value]) => {
    vars[`--radius-${key}`] = value
  })
  
  // Shadows
  Object.entries(tokens.borders.shadow).forEach(([key, value]) => {
    vars[`--shadow-${key}`] = value
  })
  
  return vars
})()

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Use CSS variables for colors
      colors: {
        // Base palette
        background: {
          DEFAULT: 'var(--color-base-50)',
          primary: 'var(--color-base-50)',
          secondary: 'var(--color-base-100)',
          tertiary: 'var(--color-base-200)',
          border: 'var(--color-base-300)',
          hover: 'var(--color-base-400)',
        },
        text: {
          primary: 'var(--color-base-950)',
          secondary: 'var(--color-base-700)',
          tertiary: 'var(--color-base-600)',
          muted: 'var(--color-base-500)',
          inverse: 'var(--color-base-50)',
        },
        
        // Brand colors
        accent: {
          teal: {
            DEFAULT: 'var(--color-teal-500)',
            foreground: 'var(--color-base-50)',
            hover: 'var(--color-teal-600)',
            light: 'var(--color-teal-50)',
          },
          orange: {
            DEFAULT: 'var(--color-orange-500)',
            foreground: 'var(--color-base-50)',
            hover: 'var(--color-orange-600)',
            light: 'var(--color-orange-50)',
          },
        },
        
        // Semantic colors
        success: 'var(--color-semantic-success)',
        warning: 'var(--color-semantic-warning)',
        error: 'var(--color-semantic-error)',
        info: 'var(--color-semantic-info)',
      },
      
      // Typography
      fontFamily: {
        sans: tokens.typography.fontFamily.sans,
        mono: tokens.typography.fontFamily.mono,
      },
      
      fontSize: {
        ...Object.fromEntries(
          Object.entries(tokens.typography.fontSize).map(([key, [size, lineHeight]]) => [
            key,
            [size, { lineHeight: lineHeight.lineHeight }]
          ])
        ),
      },
      
      fontWeight: tokens.typography.fontWeight,
      
      // Spacing
      spacing: tokens.spacing,
      
      // Border radius
      borderRadius: tokens.borders.radius,
      
      // Shadows
      boxShadow: tokens.borders.shadow,
      
      // Animation
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'tilt': 'tilt 0.3s ease-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
          '40%, 43%': { transform: 'translate3d(0, -8px, 0)' },
          '70%': { transform: 'translate3d(0, -4px, 0)' },
          '90%': { transform: 'translate3d(0, -2px, 0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: '200px 0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: 'var(--shadow-glow)' },
          '50%': { boxShadow: '0 0 30px rgba(20, 184, 166, 0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        tilt: {
          '0%': { transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' },
          '100%': { transform: 'perspective(1000px) rotateX(-5deg) rotateY(5deg)' },
        },
      },
      
      // Components
      aspectRatio: {
        '4/3': '4 / 3',
        '3/2': '3 / 2',
        '2/1': '2 / 1',
        '16/9': '16 / 9',
      },
      
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      
      screens: {
        '3xl': '1600px',
      },
    },
  },
  
  plugins: [
    // Animation utilities
    function({ addUtilities, theme }) {
      const animations = {
        '.animate-in': {
          animation: 'fadeIn 0.5s ease-in-out forwards',
        },
        '.animate-up': {
          animation: 'slideUp 0.3s ease-out forwards',
        },
        '.animate-down': {
          animation: 'slideDown 0.3s ease-out forwards',
        },
        '.animate-scale': {
          animation: 'scaleIn 0.2s ease-out forwards',
        },
        '.animate-float': {
          animation: 'float 3s ease-in-out infinite',
        },
        '.preserve-3d': {
          transformStyle: 'preserve-3d',
        },
        '.backface-hidden': {
          backfaceVisibility: 'hidden',
        },
        '.gpu': {
          transform: 'translateZ(0)',
          willChange: 'transform',
        },
      }
      
      addUtilities(animations)
    },
    
    // Glass morphism
    function({ addUtilities }) {
      const glass = {
        '.glass': {
          background: 'rgba(26, 26, 29, 0.8)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-card': {
          background: 'rgba(26, 26, 29, 0.6)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
        '.glass-border': {
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))',
        },
      }
      
      addUtilities(glass)
    },
    
    // Gradient text
    function({ addUtilities }) {
      const gradients = {
        '.text-gradient-teal': {
          background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
        '.text-gradient-orange': {
          background: 'linear-gradient(135deg, #f97316, #ea580c)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
        '.bg-gradient-teal': {
          background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
        },
        '.bg-gradient-orange': {
          background: 'linear-gradient(135deg, #f97316, #ea580c)',
        },
      }
      
      addUtilities(gradients)
    },
    
    // Skeleton loaders
    function({ addUtilities, theme }) {
      const skeleton = {
        '.skeleton': {
          background: 'linear-gradient(90deg, #374151 0%, #4b5563 50%, #374151 100%)',
          backgroundSize: '200px 100%',
          animation: 'shimmer 2s linear infinite',
          borderRadius: theme('borderRadius.base'),
        },
        '.skeleton-text': {
          height: '1rem',
          marginBottom: '0.5rem',
        },
        '.skeleton-title': {
          height: '1.5rem',
          marginBottom: '1rem',
        },
        '.skeleton-avatar': {
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: '50%',
        },
      }
      
      addUtilities(skeleton)
    },
  ],
  
  // Inject CSS variables
  corePlugins: {
    preflight: false, // We'll use our own reset
  },
}

export default config