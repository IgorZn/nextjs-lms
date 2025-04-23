'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { CheckCircle, PlayCircle, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CourseSidebarItemProps {
  key: string
  id: string
  label: string
  isCompleted: boolean
  courseId: string
  isLocked: boolean
}

function CourseSidebarItem({ key, id, label, isCompleted, courseId, isLocked }: CourseSidebarItemProps) {
  const router = useRouter()
  const pathname = usePathname()
  const Icon = isLocked ? Lock : isCompleted ? CheckCircle : PlayCircle
  const isActive = pathname?.includes(id)
  const onClick = () => {
    router.push(`/courses/${courseId}/chapters/${id}`)
  }
  return (
    <button
      onClick={onClick}
      type={'button'}
      className={cn(
        'flex items-center gap-x-2 pl-6 text-sm font-[500] text-slate-500 transition-all hover:bg-slate-200/20 hover:text-slate-700',
        isActive && 'bg-slate-200/20 text-slate-700 hover:bg-slate-200/20 hover:text-slate-700',
        isCompleted && 'text-emerald-500 hover:text-emerald-600',
        isCompleted && isActive && 'bg-emerald-200/20'
      )}>
      <div className={'flex items-center gap-x-2 py-4'}>
        <Icon
          size={'24'}
          className={cn('text-slate-500', isActive && 'text-slate-700', isCompleted && 'text-emerald-500')}
        />
        {label}
      </div>
      <div
        className={cn(
          'ml-auto h-full border-2 border-slate-700 opacity-0 transition-all',
          isActive && 'opacity-100',
          isCompleted && 'border-emerald-700'
        )}
      />
    </button>
  )
}

export default CourseSidebarItem
