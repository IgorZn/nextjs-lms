import React from 'react'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

async function CourseIdPage({ params }: { params: { courseId: Promise<string> } }) {
  const courseId = await params.courseId
  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: 'asc',
        },
      },
    },
  })

  if (!course) {
    return redirect('/')
  }

  return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`)
}

export default CourseIdPage
