'use client'
import React, { useEffect, useState } from 'react'
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import Link from 'next/link'

function NavbarRoutes(props: object) {
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const isTeacherPage = pathname?.startsWith('/teacher')
  const isPlayerPage = pathname?.includes('/chapter')

  return (
    <div className={'ml-auto flex gap-x-2'}>
      {isTeacherPage || isPlayerPage ? (
        <Link href={'/'}>
          <Button size={'sm'} variant={'ghost'}>
            <LogOut className={'mr-2 h-4 w-4'} />
            Exit
          </Button>
        </Link>
      ) : (
        <Link href={'/teacher/courses'}>
          <Button size={'sm'} variant={'ghost'}>
            Teacher mode
          </Button>
        </Link>
      )}
      {isClient && <UserButton afterSignOutUrl={'/'} />}
    </div>
  )
}

export default NavbarRoutes
