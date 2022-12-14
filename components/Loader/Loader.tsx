import React from 'react'
import { AnimationControls, motion, Variants } from 'framer-motion'
import { defaultTransition } from '../../utils/transitions'

interface Props {
  title: string
  loaderControls: AnimationControls
}

const variants: Variants = {
  initial: {
    y: 50,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: defaultTransition,
  },
}

const Loader = ({ title, loaderControls }: Props) => {
  return (
    <motion.div
      className='fixed inset-0 bg-black z-50 flex items-center justify-center font-bold select-none'
      animate={loaderControls}>
      <motion.h1
        className='text-center text-white text-5xl tracking-widest capitalize'
        variants={variants}
        initial='initial'
        animate='animate'
        transition={defaultTransition}>
        {title}
      </motion.h1>
    </motion.div>
  )
}

export default Loader
