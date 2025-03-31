'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Trash, Trash2 } from 'lucide-react'
import ConfirmModal from '@/components/modals/confirm-modal'

interface ChapterActionsProps {
  disabled: boolean
  courseId: string
  chapterId: string
  isPublished: boolean
}

function ChapterActions({ disabled, courseId, chapterId, isPublished }: ChapterActionsProps) {
  return (
    <div className={'flex items-center gap-x-2'}>
      <Button onClick={() => {}} disabled={disabled} variant={'outline'} size={'sm'}>
        {isPublished ? 'Unpublish' : 'Publish'}
      </Button>
      <ConfirmModal onConfirm={() => {}}>
        <Button className={'bg-orange-200'} onClick={() => {}} disabled={disabled} variant={'outline'} size={'sm'}>
          <Trash2 className={'h-4 w-4'} color={'red'} />
        </Button>
      </ConfirmModal>
    </div>
  )
}

export default ChapterActions
