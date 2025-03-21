import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function PUT(req: NextRequest, { params }: { params: { courseId: Promise<string> } }) {
  try {
    const { userId } = await auth()
    if (!userId) return new NextResponse('Unauthorized', { status: 401 })

    const { list } = await req.json()
    console.log('[PUT]_list', list)
    const courseId = await params.courseId

    const ownCourse = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
    })

    if (!ownCourse) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const updatePromises = list.map(item =>
      db.chapter.update({ where: { id: item.id }, data: { position: item.position } })
    )
    await Promise.all(updatePromises)

    return new NextResponse('OK', { status: 200 })
  } catch (e) {
    console.log(e.message)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
