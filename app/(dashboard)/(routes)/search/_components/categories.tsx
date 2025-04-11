'use client'

import React from 'react'
import { Category } from '@prisma/client'
import { IconType } from 'react-icons'
import {
  FcFilmReel,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode,
} from 'react-icons/fc'
import CategoryItem from '@search/_components/category-item'

interface CategoriesProps {
  items: Category[]
}

const iconMap: Record<Category['name'], IconType> = {
  Music: FcMusic,
  Photography: FcOldTimeCamera,
  Fitness: FcSportsMode,
  'Computer science': FcMultipleDevices,
  Filming: FcFilmReel,
  Accounting: FcSalesPerformance,
}

function Categories({ items }: CategoriesProps) {
  if (!items || items.length === 0) {
    return <div>No categories available</div>
  }

  // console.log('categories_raw', items)
  return (
    <div className={'flex items-center gap-x-2 overflow-x-auto pb-2'}>
      {items.map(item => (
        <div key={item.id}>
          <CategoryItem label={item.name} icon={iconMap[item.name]} value={item.id} />
        </div>
      ))}
    </div>
  )
}

export default Categories
