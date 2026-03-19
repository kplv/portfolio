import localFont from 'next/font/local'

export const abcFavorit = localFont({
  src: [
    {
      path: '../../public/fonts/ABCFavorit-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ABCFavorit-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-favorit',
  display: 'swap',
})

export const hagrid = localFont({
  src: '../../public/fonts/Hagrid-Heavy-Italic.woff2',
  variable: '--font-hagrid',
  display: 'swap',
})
