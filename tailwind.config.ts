import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        power: ["PowerGrotesk", "sans-serif"],
      },
      animation: {
        'spin-slow': 'spin 1.8s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config