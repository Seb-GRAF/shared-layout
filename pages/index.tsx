import type { NextPage } from 'next'
import { useState, useRef, useEffect } from 'react'
import { useAnimation, motion, useMotionValue, useSpring } from 'framer-motion'
import ImageLink from '../components/ImageLink'
import data from '../utils/data.json'
import Header from '../components/Header/Header'
import useWindowSize from '../hooks/useWindowSize'
import Loader from '../components/Loader'
import { defaultTransition } from '../utils/transition'

export type DataType = {
  href: string
  title: string
  color: string
  slug: string
}

const gridColumnsAnimationOffset = [800, 400, 600, 800, 600]

const Home: NextPage = () => {
  const [isGrid, setIsGrid] = useState(true)
  const window = useWindowSize()

  const loaderControls = useAnimation()
  const gridControls = useAnimation()

  const bgColor = useMotionValue('black')
  const mapData: DataType[] = [...data]

  const gridWrapperRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const xMotion = useSpring(x, { stiffness: 400, damping: 90 })
  const yMotion = useSpring(y, { stiffness: 400, damping: 90 })

  // sets VH to true 100vh
  useEffect(() => {
    if (gridWrapperRef.current) {
      gridWrapperRef.current.style.height = `${window.height}px`
    }
  }, [window.height, gridWrapperRef.current])

  // sequence for loader and grid animation
  useEffect(() => {
    async function sequence() {
      gridControls.set((index: number) => ({
        y: gridColumnsAnimationOffset[index % 5],
        scale: 1.1,
        pointerEvents: 'none',
      }))

      await gridControls.start((index: number) => ({
        y: 0,
        transition: defaultTransition,
      }))

      bgColor.set('white')

      await gridControls.start((index: number) => ({
        scale: 1,
        pointerEvents: 'auto',
        transition: defaultTransition,
      }))

      setIsGrid(false)
    }

    setTimeout(() => {
      loaderControls.start({
        opacity: 0,
        transition: defaultTransition,
      })

      sequence()
    }, 2000)
  }, [])

  const handleGridParallax = (
    event: React.MouseEvent<HTMLDivElement>
  ): void => {
    if (gridRef.current) {
      const speed = -10
      const { width, height } = gridRef.current.getBoundingClientRect()
      const offsetX = event.pageX - width * 0.5
      const offsetY = event.pageY - height * 0.5

      const newTransformX = (offsetX * speed) / 50
      const newTransformY = (offsetY * speed) / 50

      x.set(newTransformX)
      y.set(newTransformY)
    }
  }

  const handleBackgroundColorOnEnter = (color: string): void => {
    bgColor.set(color)
  }
  const handleBackgroundColorOnExit = (): void => {
    bgColor.set('#fff')
  }

  return (
    <>
      <Loader title={'Cities'} loaderControls={loaderControls} />
      <Header view={isGrid} toggleView={(value) => setIsGrid(value)} />
      <motion.div
        ref={gridWrapperRef}
        className='grid-wrapper relative  w-screen overflow-hidden transition-all ease-[cubic-bezier(0.075,0.82,0.165,1)]'
        style={{
          backgroundColor: bgColor,
          transition: 'background-color 1.25s ease-in-out 500ms',
        }}>
        {isGrid && (
          <div className='absolute w-fit h-fit top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden'>
            <motion.div
              className='grid grid-cols-a5 grid-cols-[repeat(5,15rem)] lg:grid-cols-[repeat(5,20rem)] xl:grid-cols-[repeat(5,25vw)]'
              onMouseMove={handleGridParallax}
              ref={gridRef}
              transition={defaultTransition}
              style={{
                x: xMotion,
                y: yMotion,
              }}>
              {mapData.map((element, index) => (
                <motion.div
                  key={`element-${index}`}
                  className='h-72 lg:h-96 xl:h-[35vw]'
                  animate={gridControls}
                  custom={index}>
                  <div className='px-8'>
                    <motion.div
                      className='relative w-full min-h-[18rem] flex items-center justify-center'
                      whileHover={{
                        scale: 1.1,
                        transition: {
                          duration: 1,
                        },
                      }}
                      onMouseEnter={() =>
                        handleBackgroundColorOnEnter(element.color)
                      }
                      onMouseLeave={() => handleBackgroundColorOnExit()}>
                      <ImageLink
                        element={element}
                        index={index}
                        // tailwindStyles='relative w-full min-h-[18rem] flex items-center justify-center'
                      />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
        {!isGrid && (
          <div className='overflow-x-auto overflow-y-hidden h-screen grid grid-cols-[repeat(20,1fr)] items-center px-[10vmin]'>
            {mapData.map((element, index) => (
              <div key={`element-${index}`} className='element'>
                <div
                  className='relative w-[70vmin] h-[70vmin] mx-[5vw] flex items-center justify-center'
                  onMouseEnter={() =>
                    handleBackgroundColorOnEnter(element.color)
                  }
                  onMouseLeave={() => handleBackgroundColorOnExit()}>
                  <ImageLink
                    element={element}
                    index={index}
                    // tailwindStyles='relative w-[70vmin] h-[70vmin] mx-[5vw] flex items-center justify-center'
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </>
  )
}

export default Home
