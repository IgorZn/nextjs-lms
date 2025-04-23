import React from 'react'
import { Chapter, Course, UserProgress } from '@prisma/client'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import CourseSidebar from '@/app/(course)/courses/[courseId]/_components/course-sidebar'

interface CourseMobileSidebarProps {
  course: Course & {
    chapters: Chapter & { userProgress: UserProgress[] | null }[]
  }
  progressCount: number
}

function CourseMobileSidebar({ course, progressCount }: CourseMobileSidebarProps) {
  return (
    <Sheet>
      <SheetTrigger className={'p-4 transition hover:opacity-75 md:hidden'}>
        <Menu />
      </SheetTrigger>
      <SheetContent side={'left'} className={'w-72 bg-white p-0'}>
        <CourseSidebar course={course} progressCount={progressCount} />
      </SheetContent>
    </Sheet>
  )
}

export default CourseMobileSidebar
