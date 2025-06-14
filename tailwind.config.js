/* eslint-disable unicorn/prefer-module */
const defaultTheme = require('tailwindcss/defaultTheme');
const typography = require('@tailwindcss/typography');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',

  content: [
    './public/index.html',
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {
      transitionProperty: {
        transform: 'transform',
      },

      colors: {
        primary: 'var(--color-primary)',
        white: 'var(--color-white)',
      },

      fontFamily: {
        sans: ['"Readex Pro"', ...defaultTheme.fontFamily.sans],
      },

      lineHeight: {
        relaxed: '1.7', // better readability
      },

      spacing: {
        safe: 'env(safe-area-inset-bottom)', // for padding-bottom in mobile
      },

      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            maxWidth: '100%',
            lineHeight: theme('lineHeight.relaxed'),
            h1: {
              marginTop: theme('spacing.7'),
              marginBottom: theme('spacing.4'),
              fontWeight: '700',
              fontSize: theme('fontSize.2xl'),
            },
            h2: {
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.3'),
              fontWeight: '600',
              fontSize: theme('fontSize.xl'),
            },
            h3: {
              marginTop: theme('spacing.5'),
              marginBottom: theme('spacing.3'),
              fontWeight: '600',
            },
            p: {
              marginTop: theme('spacing.3'),
              marginBottom: theme('spacing.3'),
            },
            ul: {
              marginTop: theme('spacing.3'),
              marginBottom: theme('spacing.3'),
              paddingLeft: theme('spacing.6'),
            },
            ol: {
              marginTop: theme('spacing.3'),
              marginBottom: theme('spacing.3'),
              paddingLeft: theme('spacing.6'),
            },
            li: {
              marginTop: theme('spacing.1'),
              marginBottom: theme('spacing.1'),
            },
            table: {
              marginTop: theme('spacing.5'),
              marginBottom: theme('spacing.5'),
            },
            strong: {
              fontWeight: '700',
            },
          },
        },
        dark: {
          css: {
            h1: {
              marginTop: theme('spacing.7'),
              marginBottom: theme('spacing.4'),
              fontWeight: '700',
              fontSize: theme('fontSize.2xl'),
            },
            h2: {
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.3'),
              fontWeight: '600',
              fontSize: theme('fontSize.xl'),
            },
            h3: {
              marginTop: theme('spacing.5'),
              marginBottom: theme('spacing.3'),
              fontWeight: '600',
            },
            p: {
              marginTop: theme('spacing.3'),
              marginBottom: theme('spacing.3'),
            },
            ul: {
              marginTop: theme('spacing.3'),
              marginBottom: theme('spacing.3'),
              paddingLeft: theme('spacing.6'),
            },
            ol: {
              marginTop: theme('spacing.3'),
              marginBottom: theme('spacing.3'),
              paddingLeft: theme('spacing.6'),
            },
            li: {
              marginTop: theme('spacing.1'),
              marginBottom: theme('spacing.1'),
            },
            table: {
              marginTop: theme('spacing.5'),
              marginBottom: theme('spacing.5'),
            },
            strong: {
              fontWeight: '700',
            },
          },
        },
      }),
    },
  },

  plugins: [typography],
};
