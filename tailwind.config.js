const setSpace = () => {
  const space = {}
  for (let i = 10; i <= 1000; i++) {
    space[+i] = `${i}px`
  }
  return space
}

const spacing = setSpace()

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: true,
  theme: {
    fontSize: {
      xs: '0.75rem',
      '2xs': '0.6rem',
    },
    letterSpacing: {
      maxtight: '-0.1rem',
      maxtighter: '-0.15rem',
    },

    extend: {
      rotate: {
        135: '135deg',
        225: '225deg',
      },
      lineHeight: spacing,
      spacing: spacing,
      width: spacing,
      minWidth: spacing,
      maxWidth: spacing,
      height: spacing,
      maxHeight: spacing,
      minHeight: spacing,
      borderWidth: {
        DEFAULT: '1px',
        ...spacing,
      },
      zIndex: {
        15: '15',
        20: '20',
        25: '25',
        35: '35',
        45: '45',
        55: '55',
        100: '100',
      },
      gridTemplateColumns: {
        4: 'repeat(4, auto)',
        footer: '200px minmax(900px, 1fr) 100px',
      },
    },
  },
  plugins: [],
}
