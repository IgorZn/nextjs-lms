'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Trash, Trash2 } from 'lucide-react'
import ConfirmModal from '@/components/modals/confirm-modal'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface ChapterActionsProps {
  disabled: boolean
  courseId: string
  chapterId: string
  isPublished: boolean
}

function ChapterActions({ disabled, courseId, chapterId, isPublished, pageState }: ChapterActionsProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  const onDelete = async () => {
    try {
      setIsLoading(true)
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`)
      toast.success('Chapter deleted')
      router.refresh()
      router.push(`/teacher/courses/${courseId}`)
    } catch (e) {
      console.log(e)
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const onClick = async () => {
    try {
      setIsLoading(true)
      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`)
        toast.success('Chapter unpublished')
        router.refresh()
        return
      } else {
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`)
        toast.success('Chapter published')
        router.refresh()
        return
      }
    } catch (e) {
      console.log(e)
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className={'flex items-center gap-x-2'}>
        <Button onClick={onClick} disabled={disabled || isLoading} variant={'outline'} size={'sm'}>
          {isPublished ? 'Unpublish' : 'Publish'}
        </Button>
        <ConfirmModal onConfirm={onDelete}>
          <Button className={'bg-orange-200'} onClick={() => {}} disabled={isLoading} variant={'outline'} size={'sm'}>
            <Trash2 className={'h-4 w-4'} color={'red'} />
          </Button>
        </ConfirmModal>
      </div>
    </>
  )
}

export default ChapterActions
