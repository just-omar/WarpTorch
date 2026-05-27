/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'warp-core': '#ff0000',
        'warp-shell': '#cc0000',
        'warp-core-bright': '#ff3333',
      },
    },
  },
  plugins: [],
}
