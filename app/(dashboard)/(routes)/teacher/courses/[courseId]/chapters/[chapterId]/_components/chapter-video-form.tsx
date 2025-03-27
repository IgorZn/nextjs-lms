'use client'
import React, { useEffect, useState } from 'react'
import * as z from 'zod'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ImageIcon, Pencil, PlusCircle, Video } from 'lucide-react'
import { Chapter, MuxData } from '@prisma/client'
import FileUpload from '@/components/file-upload'

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null }
  courseId: string
  chapterId: string
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
})

function ChapterVideoForm({ initialData, courseId, chapterId }: ChapterVideoFormProps) {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const [isEditing, setIsEditing] = useState(false)
  const toggleEdit = () => {
    setIsEditing(current => !current)
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
      toast.success('Chapter updated')
      toggleEdit()
      router.refresh()
    } catch (e) {
      toast.error('Something went wrong')
    }
  }
  return (
    <div className={'mt-6 rounded-md border bg-slate-100 p-2'}>
      <div className='flex items-center justify-between font-medium'>
        Chapter video
        <Button onClick={toggleEdit} variant={'ghost'}>
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className={'mr-2 h-4 w-4'} />
              Upload video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className={'mr-2 h-4 w-4'} />
              Add video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className={'flex h-60 items-center justify-center rounded-md bg-slate-200'}>
            <Video className={'h-10 w-10 text-slate-500'} />
          </div>
        ) : (
          <div className={'relative mt-2 aspect-video'}>Video uploaded</div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            onChange={(url: string) => {
              console.log('[FileUpload][onChange] url', url)
              if (url) {
                onSubmit({ videoUrl: url })
              }
            }}
            endpoint={'chapterVideo'}
          />
          <div className={'mt-4 text-sm text-muted-foreground'}>Upload this chapter&apos;s video</div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className={'mt-2 text-sm text-muted-foreground'}>Video can take a fiw minute to process</div>
      )}
    </div>
  )
}

export default ChapterVideoForm
