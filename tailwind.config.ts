import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
  darkMode: 'class',
  content: [
    'ui.config/*.ts',
    'plugins/*.ts'
  ],
  theme: {
    extend: {
      fontFamily: {
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.blue.300'),
              textDecoration: 'none',
            },
          },
        },
      }),
      colors: {
        'bloo': '#1B6ECA',
        'golden': '#E7D6C2',
          'red': {
            50: '#f2d8d7',
            100: '#e4b1af',
            200: '#d78a88',
            300: '#c96360',
            400: '#c3504c',
            500: '#bc3c38',
            600: '#a93632',
            700: '#96302d',
            800: '#842a27',
            900: '#712422',
            950: '#5e1e1c'
          },
          'purple': {
            50: '#e6dcec',
            100: '#cdbad9',
            200: '#b497c6',
            300: '#9b75b3',
            400: '#8f63aa',
            500: '#8252a0',
            600: '#754a90',
            700: '#684280',
            800: '#5b3970',
            900: '#4e3160',
            950: '#412950'
          },
          'yellow': {
            50: '#f8eedc',
            100: '#f1ddba',
            200: '#ebcb97',
            300: '#e4ba75',
            400: '#e0b263',
            500: '#dda952',
            600: '#c7984a',
            700: '#b18742',
            800: '#9b7639',
            900: '#856531',
            950: '#6f5529'
          },
          'cyan': {
            50: '#e9f6f3',
            100: '#d2ede7',
            200: '#bce4dc',
            300: '#a5dbd0',
            400: '#9ad7ca',
            500: '#8fd2c4',
            600: '#81bdb0',
            700: '#72a89d',
            800: '#649389',
            900: '#567e76',
            950: '#486962'
          },
          'blue': {
            50: '#cddcec',
            100: '#9ab8da',
            200: '#6895c7',
            300: '#3571b5',
            400: '#1c60ab',
            500: '#034ea2',
            600: '#034692',
            700: '#023e82',
            800: '#023771',
            900: '#022f61',
            950: '#022751'
          },
      }
    }
  },
  safelist: [
    {
      pattern: /gap-.*/
    }
  ]
}
