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

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
    })

    const muxDate = await db.muxData.findUnique({
      where: {
        chapterId: chapterId,
      },
    })

    if (!chapter || !muxDate || !chapter.title || !chapter.description || !chapter.videoUrl) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // Publish chapter
    const publishedChapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        isPublished: true,
      },
    })

    return NextResponse.json(publishedChapter)
  } catch (e) {
    console.log('[PATCH][COURSE_CHAPTER_PUBLISH]', e.message)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
