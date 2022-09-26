import type { NextPage } from 'next'
import { useState, useRef, useEffect, useContext } from 'react'
import {
  useAnimation,
  motion,
  useMotionValue,
  useSpring,
  PanInfo,
} from 'framer-motion'
import ImageLink from '../components/ImageLink'
import data from '../utils/data.json'
import Header from '../components/Header/Header'
import useWindowSize from '../hooks/useWindowSize'
import Loader from '../components/Loader'
import { defaultTransition, hoverTransition } from '../utils/transitions'
import { PageLoadContext } from '../contexts/PageLoadProvider'

export type DataType = {
  href: string
  title: string
  color: string
  slug: string
}

const gridColumnsAnimationOffset = [800, 400, 600, 800, 600]

const Home: NextPage = () => {
  const firstLoad = useContext(PageLoadContext)

  const [isGrid, setIsGrid] = useState(true)
  const [hoveredCityName, setHoveredCityName] = useState('')
  const [mouseMoveAllowed, setMouseMoveAllowed] = useState(false)
  const [animationsDisabled, setAnimationsDisabled] = useState(false)
  const window = useWindowSize()

  const loaderControls = useAnimation()
  const gridControls = useAnimation()
  const tooltipControls = useAnimation()

  const bgColor = useMotionValue('black')
  const mapData: DataType[] = [...data]

  const gridWrapperRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const xMotion = useSpring(x, { stiffness: 400, damping: 80 })
  const yMotion = useSpring(y, { stiffness: 400, damping: 80 })

  // sets VH to true 100vh
  useEffect(() => {
    if (gridRef.current && window.width && window.height) {
      const { width, height } = gridRef.current.getBoundingClientRect()

      const xBounds = (window.width - width) / 2
      const yBounds = (window.height - height) / 2

      x.set(xBounds)
      y.set(yBounds)
    }

    if (gridWrapperRef.current) {
      gridWrapperRef.current.style.height = `${window.height}px`
    }
  }, [window.height, window.width, gridWrapperRef.current])

  // sequence for loader and grid animation
  useEffect(() => {
    async function animationSequence() {
      if (firstLoad?.firstLoad) {
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
        firstLoad.handleFirstLoad(false)
        loaderControls.start({
          pointerEvents: 'none',
        })
        setTimeout(() => {
          setMouseMoveAllowed(true)
        }, 800)
      }
    }

    setTimeout(() => {
      loaderControls.start({
        opacity: 0,
        transition: defaultTransition,
        pointerEvents: 'none',
      })
      bgColor.set('white')
      animationSequence()
    }, 1400)
  }, [])

  // enables / disables grid move on grid toggle
  useEffect(() => {
    handleImageLeave()
    if (isGrid) {
      if (gridRef.current && window.width && window.height) {
        const { width, height } = gridRef.current.getBoundingClientRect()

        const xBounds = (window.width - width) / 2
        const yBounds = (window.height - height) / 2

        x.set(xBounds)
        y.set(yBounds)
      }
    } else {
      x.set(0)
      y.set(0)
    }
    if (!firstLoad?.firstLoad) {
      setMouseMoveAllowed(false)
      setTimeout(() => {
        setMouseMoveAllowed(true)
      }, 500)
    }
  }, [isGrid])

  const handleGridParallax = (
    event: React.MouseEvent<HTMLDivElement>
  ): void => {
    if (!mouseMoveAllowed) return

    if (gridRef.current && window.width && window.height) {
      const { width, height } = gridRef.current.getBoundingClientRect()

      // x and y cursor position (value from 0 to 1)
      const offsetX = event.pageX / window.width
      const offsetY = event.pageY / window.height

      x.set((window.width - width) * offsetX)
      y.set((window.height - height) * offsetY)
    }
  }
  const handleGridParallaxOnTouch = (
    event: MouseEvent | TouchEvent,
    info: PanInfo
  ): void => {
    if (!mouseMoveAllowed) return

    if (gridRef.current && window.width && window.height) {
      const { width, height } = gridRef.current.getBoundingClientRect()

      // x and y cursor position (value from 0 to 1)
      const offsetX = info.point.x / window.width
      const offsetY = info.point.y / window.height

      x.set((window.width - width) * offsetX)
      y.set((window.height - height) * offsetY)
    }
  }
  const handleImageEnter = (color: string, title: string): void => {
    if (!mouseMoveAllowed || animationsDisabled) return
    setHoveredCityName(title)
    bgColor.set(color)

    tooltipControls.start({
      opacity: 1,
      transition: hoverTransition,
    })
    tooltipControls.start({
      backgroundColor: color,
      transition: hoverTransition,
    })
  }
  const handleImageLeave = (): void => {
    bgColor.set('#fff')
    tooltipControls.start({
      opacity: 0,
      transition: hoverTransition,
    })
  }
  const handleGalleryHorizontalScroll = (
    event: React.WheelEvent<HTMLDivElement>
  ): void => {
    if (event.deltaY > 0) event.currentTarget.scrollLeft += 100
    if (event.deltaY < 0) event.currentTarget.scrollLeft -= 100
  }
  const horizontalGalleryVariants = {
    inView: ({ color, title }: { color: string; title: string }) => {
      handleImageEnter(color, title)
      return {}
    },
  }

  return (
    <div className='bg-black'>
      <Loader title={'Cities'} loaderControls={loaderControls} />
      <Header view={isGrid} toggleView={(value) => setIsGrid(value)} />
      <motion.div
        ref={gridWrapperRef}
        className='relative w-screen overflow-hidden transition-all ease-[cubic-bezier(0.075,0.82,0.165,1)]'
        style={{
          backgroundColor: bgColor,
          transition: 'background-color 0.5s ease-in-out',
        }}>
        {/* GRID GALLERY */}
        {isGrid && (
          <div className='absolute w-fit h-fit overflow-hidden'>
            <motion.div
              className='relative touch-none grid grid-cols-[repeat(5,17rem)] lg:grid-cols-[repeat(5,22rem)] xl:grid-cols-[repeat(5,25vw)]  p-12'
              onMouseMove={handleGridParallax}
              onPan={(e, panInfo) => {
                handleGridParallaxOnTouch(e, panInfo)
              }}
              ref={gridRef}
              transition={defaultTransition}
              style={{
                x: xMotion,
                y: yMotion,
              }}>
              {mapData.map((element, index) => (
                <motion.div
                  key={`element-${index}`}
                  className='touch-auto flex items-center justify-center h-[17rem] w-[17rem] lg:w-[22rem] lg:h-[22rem] xl:w-[25vw] xl:h-[25vw] p-4 lg:p-8 xl:p-[2vw]'
                  animate={gridControls}
                  custom={index}>
                  <motion.div className='flex items-center justify-center h-full w-full'>
                    <ImageLink
                      element={element}
                      index={index}
                      mouseMoveAllowed={mouseMoveAllowed}
                      handleImageEnter={handleImageEnter}
                      handleImageLeave={handleImageLeave}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* HORIZONTAL GALLERY */}
        {!isGrid && (
          <div
            className='overflow-x-scroll h-full grid grid-cols-[repeat(20,1fr)] items-center px-8 lg:px-24'
            onWheel={handleGalleryHorizontalScroll}
            ref={galleryRef}>
            {mapData.map((element, index) => (
              <div key={`element-${index}`} className='relative'>
                <motion.div
                  className='relative w-[70vmin] h-[70vmin] mx-[5vw] flex items-center justify-center'
                  custom={element}
                  variants={horizontalGalleryVariants}
                  whileInView={'inView'}
                  viewport={{ amount: 1 }}>
                  <ImageLink
                    element={element}
                    index={index}
                    mouseMoveAllowed={mouseMoveAllowed}
                    handleImageEnter={() => null}
                    handleImageLeave={() => null}
                    customVariants={{
                      initial: {
                        scale: 1,
                      },
                      hover: {
                        scale: 1,
                      },
                      tap: {
                        scale: 1,
                      },
                    }}
                  />
                </motion.div>
              </div>
            ))}
          </div>
        )}

        {/* TOOLTIP */}
        <motion.div
          animate={tooltipControls}
          className={`bg-red-200 w-64 py-4 sm:py-6 absolute bottom-6 opacity-0 left-[calc(50%-8rem)]  ${
            isGrid ? 'hidden' : 'flex'
          } items-center justify-center border-2 border-black pointer-events-none sm:flex`}>
          <h2 className='text-2xl font-bold'>{hoveredCityName}</h2>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Home
