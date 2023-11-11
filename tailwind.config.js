/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/components/**/*.vue",
    "./src/layouts/**/*.vue",
    "./src/pages/**/*.vue",
    "./src/plugins/**/*.{js,ts}",
    "./src/*.vue"
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
      },
      keyframes: {
        shimmer: {
          "100%": {
            transform: "translateX(100%)"
          }
        }
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwind-scrollbar")({ nocompatible: true })
  ]
}
