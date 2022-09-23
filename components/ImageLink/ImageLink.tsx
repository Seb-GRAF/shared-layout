import React from 'react'
import { DataType } from '../../pages'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { defaultTransition } from '../../utils/transition'

interface Props {
  element: DataType
  index: number
  // tailwindStyles: string
}

const ImageLink = ({ element, index }: Props): JSX.Element => {
  return (
    <Link href={`/${element.slug}`} passHref>
      <a>
        <motion.img
          src={element.href}
          alt={element.title}
          layoutId={`container-${index}`}
          transition={defaultTransition}
          // className={tailwindStyles}
          // layout='fill'
          // objectFit='contain'
        ></motion.img>
      </a>
    </Link>
  )
}

export default ImageLink
