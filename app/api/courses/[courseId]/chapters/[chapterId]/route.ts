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

export async function DELETE(req: NextRequest, { params }: { params: { courseId: string; chapterId: string } }) {
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

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
      include: {
        muxData: true,
      },
    })
    // console.log('[DELETE][COURSE_CHAPTER_ID] chapter', chapter)

    if (chapter?.muxData) {
      // delete old video
      console.log('[DELETE][COURSE_CHAPTER_ID] muxData', chapter.muxData)
      await muxMain()
        .deleteAsset(chapter.muxData.assetId)
        .catch(err => console.log('[DELETE deleteAsset][COURSE_CHAPTER_ID] err', err))

      // delete mux data from db
      await db.muxData.delete({
        where: {
          id: chapter.muxData.id,
        },
      })
    }

    if (!courseOwnership) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const deletedChapter = await db.chapter.delete({
      where: {
        id: chapterId,
        courseId,
      },
    })
    // console.log('[DELETE][COURSE_CHAPTER_ID] deletedChapter', deletedChapter)

    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    })

    // if last chapter is deleted, set course isPublished to false
    // or if last chapter is deleted, set course isPublished to false
    if (!publishedChapters.length) {
      await db.course.update({
        where: {
          id: courseId,
        },
        data: { isPublished: false },
      })
    }

    return NextResponse.json(deletedChapter)
  } catch (e) {
    console.log('[ERR][DELETE][COURSE_CHAPTER_ID]', e.message)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
