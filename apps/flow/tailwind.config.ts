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
        cyan: '#00D4FF',
        gold: '#C9A84C',
      },
    },
  },
  plugins: [],
}

export default config
