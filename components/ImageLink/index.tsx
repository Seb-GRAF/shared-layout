import React from 'react'
import { DataType } from '../../pages'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface Props {
  element: DataType
  index: number
}

const ImageLink = ({ element, index }: Props): JSX.Element => {
  return (
    <motion.img
      layoutId={`container-${index}`}
      src={element.href}
      alt={element.title}
    />
  )
}

export default ImageLink
