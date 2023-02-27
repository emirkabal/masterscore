/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./*.vue"
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1537px"
    },
    extend: {
      fontFamily: {
        maven: ["Maven Pro", "sans-serif"]
      },
      backgroundSize: {
        "blur-cover": "auto 120%"
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@headlessui/tailwindcss"),
    require("@tailwindcss/line-clamp"),
    require("tailwind-scrollbar")({ nocompatible: true })
  ]
}
