import { db } from '@/lib/db'

export const getProgress = async (courseId: string, userId: string): Promise<number> => {
  try {
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    })

    const publishedChapterIds = publishedChapters.map(chapter => chapter.id)

    const validCompletedChapters = await db.userProgress.count({
      where: {
        userId,
        chapterId: {
          in: publishedChapterIds,
        },
        isCompleted: true,
      },
    })

    console.group('[GET_PROGRESS PERCENTAGE]')
    console.log(validCompletedChapters, publishedChapters)
    console.log((validCompletedChapters / publishedChapters.length) * 100)
    console.groupEnd()

    return (validCompletedChapters / publishedChapters.length) * 100
  } catch (e) {
    console.log('[GET_PROGRESS]', e.message)
    return 0
  }
}
