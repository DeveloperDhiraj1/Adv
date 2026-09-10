/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#141310",
          light: "#211F1A",
        },
        emerald: {
          DEFAULT: "#E85D2C",
          light: "#F27D4E",
        },
        surface: "#F5F0E6",
        card: "#FFFFFF",
        ink: "#18160F",
        muted: "#78725F",
        line: "#E6DFCF",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(24,22,15,0.03), 0 16px 32px -18px rgba(24,22,15,0.18)",
        cardHover: "0 4px 10px rgba(24,22,15,0.05), 0 24px 48px -20px rgba(24,22,15,0.22)",
      },
      borderRadius: {
        xl2: "1.5rem",
      },
    },
  },
  plugins: [],
}
