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
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    })

    if (!course) return new NextResponse('Not found', { status: 404 })

    let hasPublishedChapter: boolean

    if (Array.isArray(course.chapters)) {
      // check if at least one chapter is published
      hasPublishedChapter = course.chapters.some(chapter => chapter.isPublished)
    } else {
      hasPublishedChapter = false
    }

    const required = [course.title, course.description, hasPublishedChapter, course.imageUrl, course.categoryId]

    if (!required.every(Boolean)) {
      return new NextResponse('Missing required fields', { status: 401 })
    }

    const publishedCourse = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        isPublished: true,
      },
    })

    return NextResponse.json(publishedCourse)
  } catch (e) {
    console.log('[PATCH][COURSES_PUBLISH]', e.message)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
