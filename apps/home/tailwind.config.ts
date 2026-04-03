import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#0D0D0F',
        ink: '#121318',
        gold: '#C9A84C',
        cyan: '#00D4FF',
        jade: '#00A878',
      },
    },
  },
  plugins: [],
}

export default config
