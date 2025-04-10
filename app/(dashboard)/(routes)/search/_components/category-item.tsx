'use client'

import qs from 'query-string'
import { Icon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IconType } from 'react-icons'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type CategoryItemProps = {
  label: string
  icon?: IconType
  value?: string
}

function CategoryItem({ label, icon: Icon, value }: CategoryItemProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCatId = searchParams.get('categoryId')
  const currentTitle = searchParams.get('title')
  console.log('currentCatId, currentTitle>>>', currentCatId, currentTitle)

  const isSelected = currentCatId === value

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categoryId: isSelected ? null : value,
        },
      },
      {
        skipNull: true,
        skipEmptyString: true,
      }
    )

    router.push(url)
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-x-2 rounded-full border-slate-200 px-4 py-2 transition hover:bg-muted',
        isSelected && 'border-slate-800 bg-sky-500/20 text-gray-900'
      )}>
      {Icon && <Icon size={20} />}
      <div className={'truncate'}>{label}</div>
    </button>
  )
}

export default CategoryItem
