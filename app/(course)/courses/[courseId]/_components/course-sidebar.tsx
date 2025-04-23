import React from 'react'
import { Chapter, Course, UserProgress } from '@prisma/client'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import CourseSidebarItem from '@/app/(course)/courses/[courseId]/_components/course-sidebar-item'

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null
    })[]
  }
  progressCount: number
}

async function CourseSidebar({ course, progressCount }: CourseSidebarProps) {
  const { userId } = await auth()
  if (!userId) redirect('/')

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  })
  return (
    <div className={'flex h-full flex-col overflow-y-auto border-r shadow-sm'}>
      <div className={'flex flex-col border-b p-8 text-2xl'}>
        <h1 className={'font-semibold'}>{course.title}</h1>
        {/* check purchase and add progress */}
      </div>
      <div className={'flex-full flex flex-col'}>
        {course.chapters.map(chapter => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  )
}

export default CourseSidebar
