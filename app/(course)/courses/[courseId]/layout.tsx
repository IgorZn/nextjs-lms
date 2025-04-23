import React from 'react'
import { auth } from '@clerk/nextjs/server'
import { children } from 'effect/Fiber'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { getProgress } from '@/actions/get-progress'
import CourseSidebar from '@/app/(course)/courses/[courseId]/_components/course-sidebar'
import CourseNavbar from '@/app/(course)/courses/[courseId]/_components/course-navbar'

const CourseLayout = async ({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ courseId: string }> }>) => {
  const { userId } = await auth()
  const courseId = (await params).courseId

  if (!userId) return redirect('/')

  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            },
          },
        },
        orderBy: { position: 'asc' },
      },
    },
  })

  if (!course) return redirect('/')

  const progressCount = await getProgress(course.id, userId)

  return (
    <div className={'h-full'}>
      <div className={'fixed inset-y-0 z-50 h-[80px] w-full md:pl-80'}>
        <CourseNavbar course={course} progressCount={progressCount} />
      </div>
      <div className={'fixed inset-y-0 z-50 hidden h-full w-80 flex-col md:flex'}>
        <CourseSidebar course={course} progressCount={progressCount} />
      </div>
      <main className={'h-full pt-[85px] md:pl-80'}>{children}</main>
    </div>
  )
}

export default CourseLayout
