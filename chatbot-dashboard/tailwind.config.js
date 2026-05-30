/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 24px 80px rgba(79, 70, 229, 0.14)",
        panel: "0 18px 60px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
