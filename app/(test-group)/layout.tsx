import React from 'react'

function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={'m-5 flex h-dvh flex-col justify-around border border-orange-600 bg-amber-100 md:flex-row'}>
      {children}
    </div>
  )
}

export default Layout
