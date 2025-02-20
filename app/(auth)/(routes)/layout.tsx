import React from 'react'

function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={'flex h-full items-center justify-center'}>{children}</div>
}

export default Layout
