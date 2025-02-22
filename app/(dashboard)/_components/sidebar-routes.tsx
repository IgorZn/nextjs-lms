'use client'
import React from 'react'
import { Compass, Layout } from 'lucide-react'
import SidebarItem from '@/app/(dashboard)/_components/sidebar-item'

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

function SidebarRoutes(props) {
  const routes: Array<any> = guestRoutes

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
