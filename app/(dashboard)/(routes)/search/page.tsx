import React from 'react'
import { db } from '@/lib/db'
import Categories from '@search/_components/categories'

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
    <div className={'p-6'}>
      <Categories items={categories} />
    </div>
  )
}

export default SearchPage
