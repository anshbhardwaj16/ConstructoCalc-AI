/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#081220",
        accent: "#f97316",
        sand: "#f5e6c8",
        teal: "#0f766e"
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Manrope", "sans-serif"]
      },
      boxShadow: {
        soft: "0 20px 60px rgba(8, 18, 32, 0.16)"
      }
    }
  },
  plugins: []
};
