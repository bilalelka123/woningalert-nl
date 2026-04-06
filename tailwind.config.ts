import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#08080F',
        surface:    '#11111C',
        surface2:   '#1A1A28',
        surface3:   '#22223A',
        rand:       '#2A2A42',
        oranje: {
          DEFAULT: '#FF6B2B',
          licht:   '#FF8C55',
          donker:  '#E55520',
        },
        geel: {
          DEFAULT: '#FFB800',
        },
        tekst: {
          DEFAULT: '#F0F0F8',
          gedempt: '#8888AA',
          fijn:    '#55557A',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
      boxShadow: {
        card:         '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.6)',
        oranje:       '0 0 30px rgba(255,107,43,0.3)',
      },
    },
  },
  plugins: [],
}

export default config