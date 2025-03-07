/* eslint-disable */
import React from 'react'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { IconBadge } from '@/components/icon-badge'
import { LayoutDashboard } from 'lucide-react'
import TitleForm from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/title-form'

async function Page({ params }: { params: { courseId: Promise<string> } }) {
  // https://stackoverflow.com/a/79143582/6671330
  const { courseId } = await params
  const { userId } = await auth()

  const course: Promise<any> = await db.course.findUnique({
    where: {
      id: courseId,
    },
  })

  if (!userId || !course) return redirect('/')

  // console.log('[COURSE_ID]', userId, course)
  const requiredFields = [course.title, course.description, course.imageUrl, course.price, course.categoryId]
  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length
  const completionText = `(${completedFields}/${totalFields})`

  return (
    <div className={'p-6'}>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-y-2'>
          <h1 className='text-2xl font-medium'>Course Setup</h1>
          <span className={'text-sm text-slate-700'}>Complete all fields {completionText}</span>
        </div>
      </div>
      <div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* title */}
        <div>
          <div className={'flex items-center gap-x-2'}>
            <IconBadge icon={LayoutDashboard} />
            <h2 className='text-xl'>Customize your course</h2>
          </div>
          <TitleForm initialData={course} courseId={courseId} />
        </div>
      </div>
    </div>
  )
}

export default Page
