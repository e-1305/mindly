/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Mindly brand — calm, human, modern
        primary: {
          50:  "#f0f4ff",
          100: "#e0eaff",
          200: "#c7d7fe",
          300: "#a5b8fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f8f9fc",
          subtle: "#f1f3f9",
        },
        mood: {
          great:   "#22c55e",
          good:    "#84cc16",
          neutral: "#facc15",
          low:     "#f97316",
          bad:     "#ef4444",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 2px 16px 0 rgba(99,102,241,0.08)",
        glow: "0 0 32px 0 rgba(99,102,241,0.18)",
      },
    },
  },
  plugins: [],
};
