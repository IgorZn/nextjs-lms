import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

function Logo(props: object) {
  return (
    <Link href={'/'}>
      <Image height={130} width={130} src={'/logo.svg'} alt={'logo'} {...props} />
    </Link>
  )
}

export default Logo
