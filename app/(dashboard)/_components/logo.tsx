import React from 'react'
import Image from 'next/image'

function Logo(props: object) {
  return <Image height={130} width={130} src={'/logo.svg'} alt={'logo'} {...props} />
}

export default Logo
