import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: { courseId: string; chapterId: string } }) {
  try {
    const { userId } = await auth()
    const { isPublished, ...values } = await req.json()
    const { courseId, chapterId } = await params

    console.log('[PATCH][COURSE_CHAPTER_ID] values', values)

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

    const chapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        ...values,
      },
    })

    // TODO handle videoUrl

    return NextResponse.json(chapter)
  } catch (e) {
    console.log('[PATCH][COURSE_CHAPTER_ID]', e.message)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
