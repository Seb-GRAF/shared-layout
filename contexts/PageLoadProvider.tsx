import { useState } from 'react'
import { createContext } from 'react'

interface Props {
  children: React.ReactNode
}

interface PageLoad {
  firstLoad: boolean
  handleFirstLoad: (value: boolean) => void
}

const PageLoadContext = createContext<PageLoad | null>(null)

const PageLoadProvider = ({ children }: Props): JSX.Element => {
  const [firstLoad, setFirstLoad] = useState(true)

  const handleFirstLoad = (value: boolean): void => {
    setFirstLoad(value)
  }

  return (
    <PageLoadContext.Provider value={{ firstLoad, handleFirstLoad }}>
      {children}
    </PageLoadContext.Provider>
  )
}

export { PageLoadContext, PageLoadProvider }
