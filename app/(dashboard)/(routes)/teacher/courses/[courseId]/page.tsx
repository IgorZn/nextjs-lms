import React from 'react'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { IconBadge } from '@/components/icon-badge'
import { CircleDollarSign, FileIcon, LayoutDashboard, ListChecks } from 'lucide-react'
import TitleForm from '@teacher/courses/[courseId]/_components/title-form'
import DescriptionForm from '@teacher/courses/[courseId]/_components/description-form'
import ImageForm from '@teacher/courses/[courseId]/_components/image-form'
import CategoryForm from '@teacher/courses/[courseId]/_components/category-form'
import PriceForm from '@teacher/courses/[courseId]/_components/price-form'
import AttachmentForm from '@teacher/courses/[courseId]/_components/attachment-form'
import ChaptersForm from '@teacher/courses/[courseId]/_components/chapters-form'

async function Page({ params }: { params: { courseId: Promise<string> } }) {
  // https://stackoverflow.com/a/79143582/6671330
  const { userId } = await auth()
  const param = await params
  // console.log('await params>>>', param.courseId)

  if (!userId) return redirect('/')

  const course = await db.course.findUnique({
    where: {
      id: param.courseId,
      userId,
    },
    include: {
      chapters: {
        orderBy: {
          position: 'asc',
        },
      },
      attachments: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  // console.log(categories)

  // console.log('[COURSE_ID]', userId, course)
  const requiredFields = [
    course.chapters.some(chapter => chapter.isPublished),
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
  ]
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
          <TitleForm initialData={course} courseId={param.courseId} />
          <DescriptionForm initialData={course} courseId={param.courseId} />
          <ImageForm initialData={course} courseId={param.courseId} />
          <CategoryForm
            initialData={course}
            courseId={param.courseId}
            options={categories.map(category => ({
              label: category.name,
              value: category.id,
            }))}
          />
        </div>
        <div className='space-y-6'>
          <div>
            <div className={'item-center flex gap-x-2'}>
              <IconBadge icon={ListChecks} />
              <h2 className={'text-xl'}></h2>
            </div>
            <ChaptersForm initialData={course} courseId={param.courseId} />
          </div>
          <div className={'flex items-center gap-x-2'}>
            <IconBadge icon={CircleDollarSign} />
            <h2 className={'text-xl'}>Sell you course</h2>
          </div>
          <PriceForm initialData={course} courseId={param.courseId} />
          <div>
            <div className={'flex items-center gap-x-2'}>
              <IconBadge icon={FileIcon} />
              <h2 className={'text-xl'}>Resources & Attachments</h2>
            </div>
            <AttachmentForm initialData={course} courseId={param.courseId} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
