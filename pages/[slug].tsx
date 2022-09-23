import React, { useRef, useEffect } from 'react'
import Image from 'next/image'
import HomeButton from '../components/HomeButton/HomeButton'
import Loader from '../components/Loader'
import useWindowSize from '../hooks/useWindowSize'
import { defaultTransition } from '../utils/transition'
import { motion, Variants, useAnimation } from 'framer-motion'
import type { DataType } from '.'
import data from '../utils/data.json'

interface Props {
  city: DataType
}

const variants: Variants = {
  initial: {
    opacity: 0,
    y: 100,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
}

const City = ({ city }: Props) => {
  const { height } = useWindowSize()
  const pageRef = useRef<HTMLDivElement>(null)

  const loaderControls = useAnimation()

  // sequence for loader animation
  useEffect(() => {
    setTimeout(() => {
      loaderControls.start({
        opacity: 0,
        transition: defaultTransition,
      })
    }, 2000)
  }, [])

  useEffect(() => {
    if (pageRef.current) {
      pageRef.current.style.height = `${height}px`
    }
  }, [height])

  return (
    <>
      <Loader title={city.title} loaderControls={loaderControls} />
      <HomeButton />
      <div className='model-container m-4 h-full' ref={pageRef}>
        <div className='image-wrapper h-full w-screen flex items-center justify-center'>
          <motion.div
            variants={variants}
            initial={'initial'}
            animate={'animate'}
            transition={{ defaultTransition, delay: 2 }}
            className='relative w-[80vw] min-h-[60vh] aspect-video'>
            <Image
              src={city.href}
              alt={city.title}
              layout='fill'
              objectFit='cover'
            />
          </motion.div>
        </div>
      </div>
    </>
  )
}

export const getStaticProps = async ({ params }: any) => {
  const { slug } = params
  const city = data.filter((city) => city.slug === slug)

  return {
    props: {
      city: city[0],
    },
  }
}

export const getStaticPaths = async () => {
  const paths = data.map((city) => ({
    params: { slug: city.slug },
  }))
  return {
    paths,
    fallback: false,
  }
}

export default City
