import React, { useRef, useEffect } from 'react'
import Image from 'next/image'
import HomeButton from '../components/HomeButton/HomeButton'
import Loader from '../components/Loader'
import useWindowSize from '../hooks/useWindowSize'
import { defaultTransition, defaultEase } from '../utils/transitions'
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
        pointerEvents: 'none',
        transition: defaultTransition,
      })
    }, 1000)
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
      <motion.div
        className='mx-auto model-container px-8 max-w-6xl h-full'
        ref={pageRef}>
        <div className='image-wrapper w-full flex flex-col gap-12 items-center pt-20 pb-24'>
          <motion.div
            variants={variants}
            initial={'initial'}
            animate={'animate'}
            transition={{ delay: 1.2, duration: 1, ease: defaultEase }}
            className='relative min-w-full aspect-video'>
            <Image
              src={city.href}
              alt={city.title}
              layout='fill'
              objectFit='cover'
              priority={true}
            />
          </motion.div>
          {[1, 2, 3, 4].map((paragraph, index) => (
            <motion.p
              key={`paragraph-${index}`}
              variants={variants}
              initial={'initial'}
              whileInView={'animate'}
              transition={{
                duration: 1,
                ease: defaultEase,
              }}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab
              quibusdam similique qui esse id minima ducimus voluptate eum
              officia laudantium deleniti est molestias, fugit dolores obcaecati
              odit omnis quaerat dolorum error nisi libero doloremque, rerum
              aspernatur! Quidem in quod eligendi iure, quo hic, necessitatibus
              ut cum omnis quibusdam a, ea sed reiciendis possimus mollitia
              laboriosam repellendus modi magni eveniet voluptate reprehenderit
              eum amet deserunt labore. Iste non necessitatibus reiciendis,
              excepturi alias ad magni tenetur explicabo doloribus id nobis
              soluta expedita impedit, dolores praesentium tempora voluptas!
              Soluta ipsa magnam modi illum consequuntur enim, ipsum laborum
              aut. Vitae dolorem omnis doloremque iste animi. Dolor, hic in nam
              dolorem corrupti mollitia quibusdam suscipit! Nisi aperiam animi
              libero optio architecto aspernatur nihil ullam doloribus? At
              eligendi fugit cupiditate soluta iste ut esse eaque quas sit,
              maiores dolor illum necessitatibus omnis tempora. Sed doloremque
              fugit eaque quos odit ea qui, nisi atque beatae eius ab officiis.
              Saepe nemo, aliquid similique, deleniti perferendis dolorum
              necessitatibus tempora vel eius harum debitis dolorem beatae
              pariatur. Enim reprehenderit similique dolore quaerat quidem
              aperiam? Unde debitis suscipit, mollitia, adipisci earum fuga
              recusandae officiis maxime nostrum rem hic amet! Veritatis sit
              eligendi officiis dolorem quidem facilis a ut? Eos, vel est!
            </motion.p>
          ))}
        </div>
      </motion.div>
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
