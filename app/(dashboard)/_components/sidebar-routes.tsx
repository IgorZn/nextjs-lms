'use client'
import React from 'react'
import { BarChart, Compass, Layout, List } from 'lucide-react'
import SidebarItem from '@/app/(dashboard)/_components/sidebar-item'
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

function SidebarRoutes(props) {
  const pathname = usePathname()
  const isTeacherPage = pathname?.includes('/teacher')
  const routes: Array<any> = isTeacherPage ? teacherRoutes : guestRoutes

  return (
    <div className={'flex w-full flex-col'}>
      {routes.map((route, index) => (
        <div key={route.href}>
          <SidebarItem icon={route.icon} label={route.label} href={route.href} {...route} />
        </div>
      ))}
    </div>
  )
}

export default SidebarRoutes
