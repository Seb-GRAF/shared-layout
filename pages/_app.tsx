import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { PageLoadProvider } from '../contexts/PageLoadProvider'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PageLoadProvider>
      <Component {...pageProps} />
    </PageLoadProvider>
  )
}

export default MyApp
