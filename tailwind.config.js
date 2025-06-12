const typography = require('@tailwindcss/typography');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Enable `dark:` variants based on the `.dark` class on <html> or <body>
  darkMode: 'class',

  content: [
    './public/index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {
      transitionProperty: {
        'transform': 'transform',
      },

      colors: {
        primary: 'var(--color-primary)',
        white: 'var(--color-white)',
      },

      fontFamily: {
        sans: ['"Readex Pro"', 'sans-serif'],
      },

      // Typography settings for Markdown spacing
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            'h2, h3': {
              marginTop: theme('spacing.5'),
              marginBottom: theme('spacing.3'),
            },
            'ul, ol': {
              marginTop: theme('spacing.5'),
              marginBottom: theme('spacing.3'),
            },
          },
        },
        dark: {
          css: {
            // same for dark mode
            'h2, h3': {
              marginTop: theme('spacing.5'),
              marginBottom: theme('spacing.3'),
            },
            'ul, ol': {
              marginTop: theme('spacing.5'),
              marginBottom: theme('spacing.3'),
            },
          },
        },
      }),
    },
  },

  plugins: [
    typography,
  ],
};