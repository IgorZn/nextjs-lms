'use client'
import React, { useEffect, useState } from 'react'
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import Link from 'next/link'
import SearchInput from '@/components/search-input'

function NavbarRoutes(props: object) {
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const isTeacherPage = pathname?.startsWith('/teacher')
  const isCoursePage = pathname?.includes('/courses')
  const isSearchPage = pathname?.includes('/search')

  return (
    <>
      {isSearchPage && (
        <div className={'hidden md:block'}>
          <SearchInput />
        </div>
      )}
      <div className={'ml-auto flex gap-x-2'}>
        {isTeacherPage || isCoursePage ? (
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
    </>
  )
}

export default NavbarRoutes
