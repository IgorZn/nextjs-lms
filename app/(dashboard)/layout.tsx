import React from 'react'
import Sidebar from '@/app/(dashboard)/_components/sidebar'
import Navbar from '@/app/(dashboard)/_components/navbar'

function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={'h-full'}>
      <div className={'fixed inset-y-0 z-50 h-[80px] w-full md:pl-56'}>
        <Navbar />
      </div>
      <div className={'fixed inset-y-0 z-50 hidden h-full w-56 flex-col md:flex'}>
        <Sidebar />
      </div>
      <main className={'h-full sm:pl-8 sm:pt-24 md:pl-8 md:pt-12'}>{children}</main>
    </div>
  )
}

export default DashboardLayout
