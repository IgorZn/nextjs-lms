import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { Course } from '@prisma/client'

export async function POST(req: NextRequest, { params }: { params: { courseId: Promise<string> } }) {
  try {
    const { userId } = await auth()
    const { title } = await req.json()
    const courseId = await params.courseId

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

    const lastChapter: Course = await db.chapter.findFirst({
      where: {
        courseId,
      },
      orderBy: {
        position: 'desc',
      },
    })

    const newPosition = lastChapter ? lastChapter.position + 1 : 1

    const chapter = await db.chapter.create({
      data: {
        title,
        courseId,
        position: newPosition,
      },
    })

    return NextResponse.json(chapter)
  } catch (e) {
    console.log('[CHAPTERS_POST]', e.message)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
