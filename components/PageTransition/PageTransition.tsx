import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import { defaultEase } from '../../utils/transitions'

interface Props {
  children: React.ReactNode
}

const variants = {
  out: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  in: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: defaultEase,
    },
  },
}

const PageTransition = ({ children }: Props) => {
  const { asPath } = useRouter()

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={asPath}
        variants={variants}
        animate='in'
        initial='out'
        exit='out'>
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default PageTransition
