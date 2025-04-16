import React, { Suspense } from 'react'
import { db } from '@/lib/db'
import Categories from '@search/_components/categories'
import SearchInput from '@/components/search-input'
import { getCourses } from '@/actions/get-courses'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import CoursesList from '@/components/courses-list'

interface SearchPageProps {
  searchParams: { title: string; categoryId: string }
}

async function SearchPage({ searchParams }: SearchPageProps) {
  const { userId } = await auth()
  if (!userId) return redirect('/')

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  console.log(userId, ' searchParams>>>', await searchParams)
  const courses = await getCourses({
    userId,
    ...(await searchParams),
  })

  if (!categories || categories.length === 0) {
    return (
      <div className={'p-6'}>
        <p>No categories found</p>
      </div>
    )
  }

  return (
    <>
      <Suspense>
        <div className={'mb block px-6 pt-6 md:mb-0 md:hidden'}>
          <SearchInput />
        </div>
      </Suspense>
      <div className={'p-6'}>
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  )
}

export default SearchPage
