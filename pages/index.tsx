import type { NextPage } from 'next'
import { useState, useRef, useEffect, useContext } from 'react'
import { useAnimation, motion, useMotionValue, useSpring } from 'framer-motion'
import ImageLink from '../components/ImageLink'
import data from '../utils/data.json'
import Header from '../components/Header/Header'
import useWindowSize from '../hooks/useWindowSize'
import Loader from '../components/Loader'
import { defaultTransition } from '../utils/transition'
import { PageLoadContext } from '../contexts/PageLoadProvider'

export type DataType = {
  href: string
  title: string
  color: string
  slug: string
}

const gridColumnsAnimationOffset = [800, 400, 600, 800, 600]

const imageVariants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.1,
    transition: {
      delay: 0.5,
      duration: 0.75,
    },
  },
  tap: {
    scale: 1.1,
  },
}

const Home: NextPage = () => {
  const firstLoad = useContext(PageLoadContext)

  const [isGrid, setIsGrid] = useState(true)
  const [hoveredCityName, setHoveredCityName] = useState('')
  const [mouseMoveAllowed, setMouseMoveAllowed] = useState(false)
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
  const xMotion = useSpring(x, { stiffness: 300, damping: 100 })
  const yMotion = useSpring(y, { stiffness: 300, damping: 100 })

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
  }, [window.height, gridWrapperRef.current])

  // sequence for loader and grid animation
  useEffect(() => {
    async function sequence() {
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
        firstLoad?.handleFirstLoad(false)
      }
    }

    setTimeout(() => {
      loaderControls.start({
        opacity: 0,
        transition: defaultTransition,
      })

      bgColor.set('white')

      sequence()
    }, 2000)
  }, [])

  // enables / disables grid move on grid toggle
  useEffect(() => {
    if (isGrid) {
      if (gridRef.current && window.width && window.height) {
        const { width, height } = gridRef.current.getBoundingClientRect()

        const xBounds = (window.width - width) / 2
        const yBounds = (window.height - height) / 2

        x.set(xBounds)
        y.set(yBounds)
      }
      setTimeout(() => {
        setMouseMoveAllowed(true)
      }, 1500)
    } else {
      setMouseMoveAllowed(false)
      x.set(0)
      y.set(0)
    }
  }, [isGrid])

  const handleGridParallax = (
    event:
      | React.MouseEvent<HTMLDivElement>
      | React.TouchEvent['changedTouches'][0]
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
  const handleImageEnter = async (
    color: string,
    title: string
  ): Promise<any> => {
    setHoveredCityName(title)

    bgColor.set(color)
    tooltipControls.start({
      y: 0,
      transition: { duration: 0.75, delay: 0.5 },
    })
    tooltipControls.start({
      backgroundColor: color,
      transition: { duration: 0.5 },
    })
  }
  const handleImageLeave = (): void => {
    bgColor.set('#fff')
    tooltipControls.start({
      y: 150,
      transition: { duration: 0.25 },
    })
  }
  const handleGalleryScroll = (
    event: React.WheelEvent<HTMLDivElement>
  ): void => {
    if (event.deltaY > 0) event.currentTarget.scrollLeft += 100
    if (event.deltaY < 0) event.currentTarget.scrollLeft -= 100
  }

  return (
    <>
      <Loader title={'Cities'} loaderControls={loaderControls} />
      <Header view={isGrid} toggleView={(value) => setIsGrid(value)} />
      <motion.div
        ref={gridWrapperRef}
        className='relative w-screen overflow-hidden transition-all ease-[cubic-bezier(0.075,0.82,0.165,1)]'
        style={{
          backgroundColor: bgColor,
          transition: 'background-color 0.75s ease-in-out 500ms',
        }}>
        {/* GRID GALLERY */}
        {isGrid && (
          <div className='absolute w-fit h-fit overflow-hidden'>
            <motion.div
              className='relative touch-none grid grid-cols-[repeat(5,15rem)] lg:grid-cols-[repeat(5,20rem)] xl:grid-cols-[repeat(5,25vw)]  p-12'
              onMouseMove={handleGridParallax}
              onTouchMove={(e) => {
                console.log(e)

                handleGridParallax(e.changedTouches[0])
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
                  className='h-72 lg:h-96 xl:h-[35vw] touch-auto'
                  animate={gridControls}
                  custom={index}>
                  <div className='px-8'>
                    <motion.div
                      className='relative w-full min-h-[18rem] flex items-center justify-center'
                      variants={imageVariants}
                      initial='initial'
                      whileHover='hover'
                      whileTap='tap'
                      transition={defaultTransition}
                      onTapStart={() =>
                        handleImageEnter(element.color, element.title)
                      }
                      onTapCancel={() => handleImageLeave()}
                      onMouseEnter={() =>
                        handleImageEnter(element.color, element.title)
                      }
                      onMouseLeave={() => handleImageLeave()}>
                      <ImageLink element={element} index={index} />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* HORIZONTAL GALLERY */}
        {!isGrid && (
          <div
            className='overflow-x-scroll h-full grid grid-cols-[repeat(20,1fr)] items-center px-24'
            onWheel={handleGalleryScroll}
            ref={galleryRef}>
            {mapData.map((element, index) => (
              <div key={`element-${index}`} className='relative'>
                <div
                  className='relative w-[70vmin] h-[70vmin] mx-[5vw] flex items-center justify-center'
                  onMouseEnter={() =>
                    handleImageEnter(element.color, element.title)
                  }
                  onMouseLeave={() => handleImageLeave()}>
                  <ImageLink element={element} index={index} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TOOLTIP */}
        <motion.div
          animate={tooltipControls}
          className='bg-red-200 w-96 py-8 absolute bottom-4 left-[calc(50%-12rem)]  flex items-center justify-center border-2 border-black'>
          <h2 className='text-3xl font-bold'>{hoveredCityName}</h2>
        </motion.div>
      </motion.div>
    </>
  )
}

export default Home
