import type { NextPage } from 'next'
import { useState, useRef } from 'react'
import ImageLink from '../components/ImageLink'
import data from '../utils/data.json'
import Header from '../components/Header'

export type DataType = {
  href: string
  title: string
  color: string
  slug: string
}

const Home: NextPage = () => {
  const [gridVisible, setGridVisible] = useState(false)

  const mapData: DataType[] = [...data]

  return (
    <>
      <Header
        view={gridVisible}
        toggleView={(value) => setGridVisible(value)}
      />
      <div className='relative h-screen w-screen overflow-hidden transition-all ease-[cubic-bezier(0.075,0.82,0.165,1)]'>
        {gridVisible && (
          <div className='absolute w-[120%] h-[120%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <div className='grid grid-cols-5'>
              {data.map((element, index) => (
                <div key={`element-${index}`} className='w-full h-96'>
                  <div className='p-8'>
                    <div className='relative w-full min-h-[18rem] flex items-center justify-center'>
                      <ImageLink element={element} index={index} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {!gridVisible && (
          <div className='overflow-x-auto overflow-y-hidden h-screen grid grid-cols-[repeat(20,1fr)] items-center px-[10vmin]'>
            {data.map((element, index) => (
              <div key={`element-${index}`} className='element'>
                <div className='relative w-[70vmin] h-[70vmin] mx-[5vw] flex items-center justify-center'>
                  <ImageLink element={element} index={index} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Home
