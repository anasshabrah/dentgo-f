module.exports = {
  // Enable `dark:` variants based on the `.dark` class on <html> or <body>
  darkMode: 'class',

  content: [
    './public/index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        white  : 'var(--color-white)',
      },

      fontFamily: {
        sans: ['"Readex Pro"', 'sans-serif'],
      },
    },
  },

  plugins: [],
};
