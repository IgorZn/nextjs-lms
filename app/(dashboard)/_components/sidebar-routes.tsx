'use client'
import React from 'react'
import { BarChart, Compass, Layout, List } from 'lucide-react'
import SidebarItem, { SidebarItemProps } from '@/app/(dashboard)/_components/sidebar-item'
import { usePathname } from 'next/navigation'

const guestRoutes = [
  {
    href: '/',
    label: 'Dashboard',
    icon: Layout,
  },
  {
    icon: Compass,
    label: 'Browse',
    href: '/search',
  },
]

const teacherRoutes = [
  {
    href: '/teacher/courses',
    label: 'Courses',
    icon: List,
  },
  {
    icon: BarChart,
    label: 'Analytics',
    href: '/teacher/analytics',
  },
]

function SidebarRoutes(props: object) {
  const pathname = usePathname()
  const isTeacherPage = pathname?.includes('/teacher')
  const routes: Array<SidebarItemProps> = isTeacherPage ? teacherRoutes : guestRoutes

  return (
    <div className={'flex w-full flex-col'}>
      {routes.map((route, index) => (
        <div key={route.href}>
          <SidebarItem {...route} />
        </div>
      ))}
    </div>
  )
}

export default SidebarRoutes
