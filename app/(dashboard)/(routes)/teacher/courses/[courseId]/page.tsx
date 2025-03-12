/* eslint-disable */
import React from 'react'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { IconBadge } from '@/components/icon-badge'
import { LayoutDashboard } from 'lucide-react'
import TitleForm from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/title-form'
import DescriptionForm from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/description-form'
import ImageForm from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/image-form'
import { Course } from '@prisma/client'
import CategoryForm from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/category-form'

async function Page({ params }: { params: { courseId: string } }) {
  // https://stackoverflow.com/a/79143582/6671330
  const { userId } = await auth()
  // const param = await params
  // console.log('await params>>>', param.courseId)

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
  })

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  // console.log(categories)

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
          <TitleForm initialData={course} courseId={params.courseId} />
          <DescriptionForm initialData={course} courseId={params.courseId} />
          <ImageForm initialData={course} courseId={params.courseId} />
          <CategoryForm
            initialData={course}
            courseId={params.courseId}
            options={categories.map(category => ({
              label: category.name,
              value: category.id,
            }))}
          />
        </div>
      </div>
    </div>
  )
}

export default Page
