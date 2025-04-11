'use client'
import React from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'

function SearchInput() {
  const [value, setValue] = React.useState('')
  const debounce = useDebounce(value)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const currentCategoryId = searchParams.get('categoryId')

  React.useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: debounce,
          categoryId: currentCategoryId,
        },
      },
      {
        skipNull: true,
        skipEmptyString: true,
      }
    )

    router.push(url)
  }, [debounce, currentCategoryId, pathname, router])

  return (
    <div className={'relative'}>
      <Search className={'absolute left-3 top-3 h-4 w-4 text-slate-600'} />

      <Input
        className={'bg-slate-1 00 w-full rounded-full pl-9 md:w-[300px]'}
        placeholder={'Search'}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </div>
  )
}

export default SearchInput
