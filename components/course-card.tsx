import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { IconBadge } from '@/components/icon-badge'
import { BookOpen } from 'lucide-react'
import { formatPrice } from '@/lib/format'

interface CourseCardProps {
  id: string
  title: string
  imageUrl: string | null
  chaptersLength: number
  category: string | undefined
  progress: number | null
  price: number | null
}

function CourseCard({ id, title, imageUrl, chaptersLength, category, progress, price }: CourseCardProps) {
  return (
    <Link href={`/course/${id}`}>
      <div className={'group h-full overflow-hidden rounded-lg border p-3 transition hover:shadow-sm'}>
        <div className={'relative aspect-video w-full overflow-hidden rounded-md'}>
          <Image className={'object-cover'} src={imageUrl as string} alt={title} fill />
        </div>
      </div>
      <div className={'flex flex-col pt-2'}>
        <div className={'line-clamp-2 text-lg font-medium transition group-hover:text-sky-700 md:text-base'}>
          {title}
        </div>
        <p className={'text-xs text-muted-foreground'}>{category}</p>
        <div className={'my-3 flex items-center gap-x-2 text-sm md:text-xs'}>
          <div className={'flex items-center gap-x-1 text-slate-500'}>
            <IconBadge icon={BookOpen} size={'sm'} />
            <span>
              {chaptersLength}{' '}
              {chaptersLength === 1 ? (
                <span className={'lowercase text-slate-500'}>chapter</span>
              ) : (
                <span className={'lowercase text-slate-500'}>chapters</span>
              )}
            </span>
          </div>
        </div>
        {progress !== null ? (
          <div>TODO: progress component</div>
        ) : (
          <p className={'text-md font-bold text-slate-600 md:text-sm'}>{formatPrice(price as number)}</p>
        )}
      </div>
    </Link>
  )
}

export default CourseCard
