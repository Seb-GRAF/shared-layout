import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { PageLoadProvider } from '../contexts/PageLoadProvider'
import PageTransition from '../components/PageTransition'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PageLoadProvider>
      <PageTransition>
        <Component {...pageProps} />
      </PageTransition>
    </PageLoadProvider>
  )
}

export default MyApp
