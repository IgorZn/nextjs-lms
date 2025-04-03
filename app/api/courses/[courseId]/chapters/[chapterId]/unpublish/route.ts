import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { aggregateWithinEither } from 'effect/Stream'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { courseId: string; chapterId: Promise<string> } }
) {
  try {
    const { userId } = await auth()
    const { courseId, chapterId } = await params

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const courseOwnership = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    })

    if (!courseOwnership) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const unpublishedChapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        isPublished: false,
      },
    })

    // Check if any chapters are published in the course
    const publishedChapterInCourse = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    })

    // If no chapters are published in the course, set isPublished for course to FALSE
    if (!publishedChapterInCourse.length) {
      await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      })
    }

    return NextResponse.json(unpublishedChapter)
  } catch (e) {
    console.log('[PATCH][COURSE_CHAPTER_UNPUBLISH]', e.message)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
