/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        kodchasan: ["Kodchasan-SemiBold", "sans-serif"],
        kodchasanMed: ["Kodchasan-Medium", "sans-serif"],
        InterSemi: ["Inter-Semibold", "sans-serif"],
      },
    },
  },
  plugins: [],
};
