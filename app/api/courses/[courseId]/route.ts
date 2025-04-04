import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { muxMain } from '@/lib/video_mux'

export async function PATCH(req: NextRequest, { params }: { params: { courseId: Promise<string> } }) {
  try {
    const { userId } = await auth()
    const values = await req.json()
    const { courseId } = await params

    if (!userId) return new NextResponse('Unauthorized', { status: 401 })

    const course = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        ...values,
      },
    })

    return NextResponse.json(course)
  } catch (e) {
    console.log(e.message)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { courseId: Promise<string> } }) {
  try {
    const { userId } = await auth()
    const { courseId } = await params

    if (!userId) return new NextResponse('Unauthorized', { status: 401 })

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
      include: {
        chapters: { include: { muxData: true } },
      },
    })

    if (!course) return new NextResponse('Not found', { status: 404 })

    course.chapters.map(async chapter => {
      if (chapter.muxData?.assetId) {
        await muxMain().deleteAsset(chapter.muxData.assetId)
      }
    })

    const deletedCourse = await db.course.delete({
      where: {
        id: courseId,
        userId,
      },
    })

    return NextResponse.json(deletedCourse)
  } catch (e) {
    console.log('[COURSES_DELETE]', e)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
