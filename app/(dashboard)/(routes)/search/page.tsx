import React, { Suspense } from 'react'
import { db } from '@/lib/db'
import Categories from '@search/_components/categories'
import SearchInput from '@/components/search-input'

async function SearchPage(props: object) {
  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
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
      </div>
    </>
  )
}

export default SearchPage
