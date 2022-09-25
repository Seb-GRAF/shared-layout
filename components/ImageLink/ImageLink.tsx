import React from 'react'
import { DataType } from '../../pages'
import Link from 'next/link'
import { motion, Variants } from 'framer-motion'
import { defaultTransition, hoverTransition } from '../../utils/transitions'

interface Props {
  element: DataType
  index: number
  mouseMoveAllowed: boolean
  handleImageEnter: (color: string, title: string) => void
  handleImageLeave: () => void
  customVariants?: Variants
}

const variants = {
  initial: {
    scale: 1,
    transition: hoverTransition,
  },
  hover: {
    scale: 1.1,
    transition: hoverTransition,
  },
  tap: {
    scale: 1.1,
    transition: hoverTransition,
  },
}

const ImageLink = ({
  element,
  index,
  mouseMoveAllowed,
  handleImageEnter,
  handleImageLeave,
  customVariants,
}: Props): JSX.Element => {
  return (
    <Link href={`/${element.slug}`} passHref>
      <a className='h-full flex items-center justify-center'>
        <motion.img
          className='h-full w-full object-contain'
          src={element.href}
          alt={element.title}
          layoutId={`container-${index}`}
          variants={customVariants ?? variants}
          initial='initial'
          whileHover={`${mouseMoveAllowed ? 'hover' : ''}`}
          whileTap='tap'
          transition={defaultTransition}
          onTapStart={() => handleImageEnter(element.color, element.title)}
          onTapCancel={() => handleImageLeave()}
          onHoverStart={() => handleImageEnter(element.color, element.title)}
          onHoverEnd={() => handleImageLeave()}
        />
      </a>
    </Link>
  )
}

export default ImageLink
