import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: { courseId: Promise<string> } }) {
  const { userId } = await auth()
  const courseId = await params.courseId

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    })

    if (!course) return new NextResponse('Not found', { status: 404 })

    const unPublishCourse = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        isPublished: false,
      },
    })

    return NextResponse.json(unPublishCourse)
  } catch (e) {
    console.log('[PATCH][COURSES_UNPUBLISH]', e.message)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
