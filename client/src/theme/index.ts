// Pure Living Pro - Design System Theme Configuration
// Centralized design tokens for consistent UI/UX

export const theme = {
  // Color Palette - Wellness & Nature Inspired
  colors: {
    primary: {
      50: 'hsl(120, 20%, 95%)',
      100: 'hsl(120, 20%, 90%)',
      500: 'hsl(120, 25%, 45%)', // Tulsi leaf green
      600: 'hsl(120, 25%, 35%)',
      900: 'hsl(120, 25%, 15%)',
    },
    sage: {
      50: 'hsl(90, 15%, 95%)',
      100: 'hsl(90, 15%, 85%)',
      500: 'hsl(90, 15%, 65%)',
      700: 'hsl(90, 15%, 45%)',
    },
    earth: {
      100: 'hsl(30, 20%, 90%)',
      300: 'hsl(30, 20%, 70%)',
      500: 'hsl(30, 20%, 50%)',
      700: 'hsl(30, 20%, 30%)',
    }
  },

  // Typography Scale
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      display: ['Cal Sans', 'Inter', 'sans-serif'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    }
  },

  // Spacing System
  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',  // 48px
    '3xl': '4rem',  // 64px
  },

  // Border Radius
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },

  // Shadows
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },

  // Component Specific Tokens
  components: {
    card: {
      padding: 'p-6',
      borderRadius: 'rounded-xl',
      shadow: 'shadow-md',
      border: 'border border-gray-200',
      hover: 'hover:shadow-lg transition-shadow duration-200',
    },
    button: {
      primary: 'bg-primary-500 hover:bg-primary-600 text-white',
      secondary: 'bg-sage-100 hover:bg-sage-200 text-sage-700',
      ghost: 'hover:bg-gray-100 text-gray-700',
      padding: 'px-4 py-2',
      borderRadius: 'rounded-lg',
    },
    input: {
      base: 'border border-gray-300 rounded-md px-3 py-2',
      focus: 'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
      error: 'border-red-500 focus:ring-red-500 focus:border-red-500',
    }
  },

  // Animation & Transitions
  animation: {
    duration: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
    }
  },

  // Breakpoints
  screens: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  }
} as const;

// Helper function to get theme values
export const getThemeValue = (path: string) => {
  return path.split('.').reduce((obj, key) => obj?.[key], theme);
};

// Component class builders
export const cardClasses = `${theme.components.card.padding} ${theme.components.card.borderRadius} ${theme.components.card.shadow} ${theme.components.card.border} ${theme.components.card.hover}`;

export const buttonClasses = {
  primary: `${theme.components.button.primary} ${theme.components.button.padding} ${theme.components.button.borderRadius}`,
  secondary: `${theme.components.button.secondary} ${theme.components.button.padding} ${theme.components.button.borderRadius}`,
  ghost: `${theme.components.button.ghost} ${theme.components.button.padding} ${theme.components.button.borderRadius}`,
};

export const inputClasses = `${theme.components.input.base} ${theme.components.input.focus}`;