import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { columns } from '@teacher/courses/_components/columns'
import { DataTable } from '@teacher/courses/_components/data-table'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'

async function Page(props: object) {
  const { userId } = await auth()

  if (!userId) return redirect('/')

  const data = await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className={'p-6'}>
      <Link href={'/teacher/create'}>
        <Button>New Course</Button>
      </Link>
      <div className='container mx-auto py-10'>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}

export default Page
