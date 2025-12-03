/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        purple: 'var(--color-purple)',
        orange: 'var(--color-orange)',
        offwhite: 'var(--color-offwhite)',
        dark: 'var(--color-dark)',
      },
      borderRadius: {
        soft: 'var(--radius-soft)',
      },
    },
  },
  plugins: [],
};

