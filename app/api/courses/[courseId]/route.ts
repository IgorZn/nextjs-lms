import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = await auth()
    const values = await req.json()

    if (!userId) return new NextResponse('Unauthorized', { status: 401 })

    const course = await db.course.update({
      where: {
        id: params.courseId,
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
