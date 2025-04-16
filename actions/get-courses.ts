import { Category } from '@prisma/client'
import { db } from '@/lib/db'
import { getProgress } from '@/actions/get-progress'

type CourseWithProgressWithCategory = {
  category: Category | null
  chapters: { id: string }[]
  progress: number | null
}

type GetCoursesParams = {
  userId: string
  title?: string
  categoryId?: string
}

export const getCourses = async ({
  userId,
  title,
  categoryId,
}: GetCoursesParams): Promise<CourseWithProgressWithCategory[]> => {
  try {
    if (![userId, title, categoryId].every(Boolean)) {
      console.group()
      console.log('Missing required fields')
      console.table({ userId, title, categoryId })
      console.groupEnd()
      return []
    }

    let courses
    await db.course
      .findMany({
        where: {
          isPublished: true,
          OR: [
            {
              title: {
                contains: title,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: title,
                mode: 'insensitive',
              },
            },
          ],
          categoryId,
        },
        include: {
          category: true,
          chapters: {
            where: {
              isPublished: true,
            },
            select: {
              id: true,
            },
          },
          purchases: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
      .then(result => {
        courses = result
      })
      .catch(e => {
        console.error('[GET_COURSES, DB, ERR]', e.message)
      })

    if (courses) {
      console.log('found COURSES', courses)
      return (await Promise.all(
        courses?.map(async course => {
          if (course.purchases.length === 0) {
            return {
              ...course,
              progress: null,
            }
          }

          const progressPercent = await getProgress(course.id, userId)

          console.log('progressPercent', progressPercent)

          return {
            ...course,
            progress: progressPercent,
          }
        })
      )) as CourseWithProgressWithCategory[]
    } else {
      console.log('NO COURSES were found')
      console.table(courses)
      return []
    }
  } catch (error) {
    console.log('[GET_COURSES]', error)
    return []
  }
}
