/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        radar: {
          bg: "#060912",
          card: "#101624",
          muted: "#7B8496",
          line: "#202A3D",
          green: "#22C55E",
          yellow: "#F59E0B",
          red: "#EF4444",
          cyan: "#38BDF8"
        }
      }
    }
  },
  plugins: []
};
