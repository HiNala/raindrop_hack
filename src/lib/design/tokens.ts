import { z } from 'zod'

// Design Token Schema for type safety
export const DesignTokensSchema = z.object({
  colors: z.object({
    base: z.object({
      0: z.string(),
      50: z.string(),
      100: z.string(),
      200: z.string(),
      300: z.string(),
      400: z.string(),
      500: z.string(),
      600: z.string(),
      700: z.string(),
      800: z.string(),
      900: z.string(),
      950: z.string(),
    }),
    brand: z.object({
      teal: z.object({
        50: z.string(),
        500: z.string(),
        600: z.string(),
        700: z.string(),
      }),
      orange: z.object({
        50: z.string(),
        500: z.string(),
        600: z.string(),
        700: z.string(),
      }),
    }),
    semantic: z.object({
      success: z.string(),
      warning: z.string(),
      error: z.string(),
      info: z.string(),
    }),
  }),
  typography: z.object({
    fontFamily: z.object({
      sans: z.array(z.string()),
      mono: z.array(z.string()),
    }),
    fontSize: z.record(z.tuple([z.string(), z.object({})])),
    fontWeight: z.object({
      normal: z.number(),
      medium: z.number(),
      semibold: z.number(),
      bold: z.number(),
    }),
  }),
  spacing: z.record(z.string()),
  borders: z.object({
    radius: z.record(z.string()),
    shadow: z.record(z.string()),
  }),
})

export type DesignTokens = z.infer<typeof DesignTokensSchema>

// Production-ready design tokens
export const tokens: DesignTokens = {
  colors: {
    base: {
      0:   '#000000', // Pure black
      50:  '#0a0a0b', // Primary background
      100: '#141417', // Elevated surfaces
      200: '#1a1a1d', // Cards and panels
      300: '#27272a', // Borders and dividers
      400: '#3f3f46', // Hover states
      500: '#52525b', // Secondary text
      600: '#71717a', // Tertiary text
      700: '#a1a1aa', // Muted text
      800: '#d4d4d8', // Light text
      900: '#fafafa', // Primary text
      950: '#ffffff', // Pure white
    },
    brand: {
      teal: {
        50:  '#f0fdfa',
        500: '#14b8a6',
        600: '#0d9488',
        700: '#0f766e',
      },
      orange: {
        50:  '#fff7ed',
        500: '#f97316',
        600: '#ea580c',
        700: '#c2410c',
      },
    },
    semantic: {
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Consolas', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  spacing: {
    '0': '0px',
    '1': '0.25rem',   // 4px
    '2': '0.5rem',    // 8px
    '3': '0.75rem',   // 12px
    '4': '1rem',      // 16px
    '5': '1.25rem',   // 20px
    '6': '1.5rem',    // 24px
    '8': '2rem',      // 32px
    '10': '2.5rem',   // 40px
    '12': '3rem',     // 48px
    '16': '4rem',     // 64px
    '20': '5rem',     // 80px
    '24': '6rem',     // 96px
  },
  borders: {
    radius: {
      none: '0px',
      sm: '0.125rem',  // 2px
      base: '0.25rem', // 4px
      md: '0.375rem',  // 6px
      lg: '0.5rem',    // 8px
      xl: '0.75rem',   // 12px
      '2xl': '1rem',   // 16px
      full: '9999px',
    },
    shadow: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      glow: '0 0 20px rgba(20, 184, 166, 0.3)',
      glass: '0 8px 32px rgba(0, 0, 0, 0.3)',
    },
  },
}

// CSS custom properties for runtime access
export function generateCSSVariables(tokens: DesignTokens) {
  const variables: Record<string, string> = {}

  // Colors
  Object.entries(tokens.colors.base).forEach(([key, value]) => {
    variables[`--color-base-${key}`] = value
  })

  Object.entries(tokens.colors.brand).forEach(([brand, shades]) => {
    Object.entries(shades).forEach(([shade, value]) => {
      variables[`--color-${brand}-${shade}`] = value
    })
  })

  // Spacing
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    variables[`--spacing-${key}`] = value
  })

  // Borders
  Object.entries(tokens.borders.radius).forEach(([key, value]) => {
    variables[`--radius-${key}`] = value
  })

  Object.entries(tokens.borders.shadow).forEach(([key, value]) => {
    variables[`--shadow-${key}`] = value
  })

  return variables
}
