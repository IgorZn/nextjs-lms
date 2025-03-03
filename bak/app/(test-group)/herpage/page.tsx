import React from 'react'
import { Button } from '@/components/ui/button'

function Page(props: object) {
  return (
    <div>
      <Button variant={'outline'}>1</Button>
      <Button variant={'destructive'}>2</Button>
      <Button variant={'secondary'}>3</Button>
    </div>
  )
}

export default Page
