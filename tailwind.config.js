/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#E36B37",
        secondary: "#6D6D6D",
        deepBlue: "#091B38",
      },
      fontFamily: {
        modak: ["Modak", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
