import { db } from '@/lib/db'
import { Attachment, Chapter } from '@prisma/client'

interface GetChapterProps {
  chapterId: string
  userId: string
  courseId: string
}

export const getChapter = async ({ chapterId, userId, courseId }: GetChapterProps) => {
  try {
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    })

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
      select: {
        price: true,
      },
    })

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
    })

    if (!chapter || !course) {
      throw new Error('Chapter or course not found')
    }

    let muxDate = null
    let attachments: Attachment[] = []
    let nextChapter: Chapter | null = null

    if (purchase) {
      attachments = await db.attachment.findMany({
        where: {
          courseId,
        },
      })
    }

    if (chapter.isFree || purchase) {
      muxDate = await db.muxData.findUnique({
        where: {
          chapterId,
        },
      })
      nextChapter = await db.chapter.findFirst({
        where: {
          courseId,
          position: {
            gt: chapter.position,
          },
        },
        orderBy: {
          position: 'asc',
        },
      })
    }

    const userProgress = await db.userProgress.findFirst({
      where: {
        userId,
        chapterId,
      },
    })

    return {
      chapter,
      course,
      muxDate,
      attachments,
      nextChapter,
      userProgress,
      purchase,
    }
  } catch (error) {
    console.log('[GET_CHAPTER]', error)
    return {
      chapter: null,
      course: null,
      muxData: null,
      attachments: [],
      nextChapter: null,
      userProgress: null,
      purchase: null,
    }
  }
}
