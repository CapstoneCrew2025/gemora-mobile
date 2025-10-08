/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",                        // okay if you have App.tsx using className
    "./app/**/*.{js,jsx,ts,tsx}",       // scans all screens (index, login, register)
    "./components/**/*.{js,jsx,ts,tsx}" // scans all components
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}
