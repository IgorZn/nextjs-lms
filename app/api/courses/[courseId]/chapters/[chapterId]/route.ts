import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { muxMain } from '@/lib/video_mux'

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

    if (values.videoUrl) {
      const existMuxData = await db.muxData.findFirst({
        where: {
          chapterId,
        },
      })

      // delete old video
      if (existMuxData) {
        await muxMain().deleteAsset(existMuxData.assetId)
        await db.muxData.delete({
          where: {
            id: existMuxData.id,
          },
        })
      }

      // create new
      const asset = await muxMain().createAsset(values.videoUrl)
      console.log('[PATCH][COURSE_CHAPTER_ID] asset', asset)
      await db.muxData.create({
        data: {
          chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids[0].id,
        },
      })
    }

    return NextResponse.json(chapter)
  } catch (e) {
    console.log('[ERR][PATCH][COURSE_CHAPTER_ID]', e.message)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
