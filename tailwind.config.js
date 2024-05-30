/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        customBlue: '#0A4A9B',
      }
    },
  },
  plugins: [{ tailwindcss: {}, autoprefixer: {} }],
};
