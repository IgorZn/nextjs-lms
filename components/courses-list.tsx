import React from 'react'
import { Category, Course } from '@prisma/client'
import CourseCard from '@/components/course-card'

type CourseListProps = Course[] & {
  category: Category | null
  chapters: { id: string }[]
  progress: number | null
}

function CoursesList({ items }: CourseListProps[]) {
  return (
    <div>
      <div className={'grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'}>
        {items.map(item => (
          <div key={item.id}>
            <CourseCard
              id={item.id}
              title={item.title}
              imageUrl={item.imageUrl}
              chaptersLength={item.chapters.length}
              category={item?.category?.name}
              progress={item.progress}
              price={item.price}
            />
          </div>
        ))}
        {items.length === 0 && (
          <div className={'mt-10 text-center'}>
            <p className={'text-sm text-muted-foreground md:text-lg md:font-medium'}>No courses found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CoursesList
