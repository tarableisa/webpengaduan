/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // semua file React di src folder
  ],
  theme: {
    extend: {
      backgroundImage: {
        'waarna-gradient': 'linear-gradient(135deg, #ffe6e6, #ffcccc, #ffe6e6)',
      },
      animation: {
        'bg-slide': 'slide 15s ease infinite',
      },
      keyframes: {
        slide: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};
