import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'

interface Props {
  children: React.ReactNode
}

const variants = {
  out: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
  in: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
}

const PageTransition = ({ children }: Props) => {
  const { asPath } = useRouter()

  return (
    <AnimatePresence mode='wait' initial={false}>
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
