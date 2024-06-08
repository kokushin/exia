/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./renderer/src/pages/**/*.{js,ts,jsx,tsx}", "./renderer/src/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        fadeIn: "fadeIn .4s ease",
        fadeOut: "fadeOut .4s ease",
      },
    },
  },
  plugins: [],
};
