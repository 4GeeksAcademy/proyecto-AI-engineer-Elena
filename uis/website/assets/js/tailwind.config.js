tailwind.config = {
  theme: {
    extend: {
      colors: {
        surface: { DEFAULT: '#FFFFFF', alt: '#F2F6F8' },
        primary: { DEFAULT: '#1B4965', dark: '#0F2E42', tint: '#E3EEF3' },
        ink: '#1F2A33',
        muted: '#4A5A66',
        accent: { DEFAULT: '#B4461F', dark: '#8F3516', light: '#F2A07B' },
        'footer-text': '#B8C9D4',
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      borderRadius: { lg: '8px', xl: '12px' },
    },
  },
};
