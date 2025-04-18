import React, { Suspense } from 'react'
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
      <Suspense>
        <main className={'h-full pt-[85px] sm:pl-8 md:pl-60'}>{children}</main>
      </Suspense>
    </div>
  )
}

export default DashboardLayout
