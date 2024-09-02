/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "loop-scroll": "loop-scroll 25s linear infinite",
      },
      keyframes: {
        "loop-scroll": {
          from: { transform: "translatex(0)" },
          to: { transform: "translatex(-100%)" }
        }
      }
    },
  },
  plugins: [],
};
