import React from 'react'
import data from '../utils/data.json'

const City = ({ city }: any) => {
  console.log(city)

  return (
    <div>
      <h1>{city.title}</h1>
    </div>
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
