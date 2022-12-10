import { extendTheme } from 'native-base';

export const THEME = extendTheme({
  colors: {
    green: {
      700: '#00875F',
      500: '#00B37E',
    },
    gray: {
      700: '#F7F7F8',
      600: '#ECECEC',
      500: '#D9D8DA',
      400: '#9F9BA1',
      300: '#5F5B62',
      200: '#3E3A40',
      100: '#1A181B',
    },
    white: '#FFFFFF',
    red: {
      100: '#F75A68',
    },
    blue: {
      100: '#364D9D',
      200: '#647AC7',
    },    
  },
  fonts: {
    heading: 'Karla_700Bold',
    body: 'Karla_400Regular',
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
  },
  sizes: {
    14: 56,
    33: 148
  }
})