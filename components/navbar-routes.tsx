import React from 'react'
import { UserButton } from '@clerk/nextjs'

function NavbarRoutes(props) {
  return (
    <div className={'ml-auto flex gap-x-2'}>
      <UserButton className={'h-full'} />
    </div>
  )
}

export default NavbarRoutes
