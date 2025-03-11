'use client'
import React, { useEffect, useState } from 'react'
import * as z from 'zod'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react'
import { Course } from '@prisma/client'
import FileUpload from '@/components/file-upload'
import Image from 'next/image'

interface ImageFormProps {
  initialData: Course
  courseId: string
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: 'ImageUrl is required',
  }),
})

function ImageForm({ initialData, courseId }: ImageFormProps) {
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
      await axios.patch(`/api/courses/${courseId}`, values)
      toast.success('Course updated')
      toggleEdit()
      router.refresh()
    } catch (e) {
      toast.error('Something went wrong')
    }
  }
  return (
    <div className={'mt-6 rounded-md border bg-slate-100 p-2'}>
      <div className='flex items-center justify-between font-medium'>
        Course image
        <Button onClick={toggleEdit} variant={'ghost'}>
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className={'mr-2 h-4 w-4'} />
              Add an image
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className={'mr-2 h-4 w-4'} />
              Edit image
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className={'flex h-60 items-center justify-center rounded-md bg-slate-200'}>
            <ImageIcon className={'h-10 w-10 text-slate-500'} />
          </div>
        ) : (
          <div className={'relative mt-2 aspect-video'}>
            {isClient && (
              <Image
                fill
                src={initialData.imageUrl}
                alt={'Upload'}
                className={'h-full w-full rounded-md object-cover'}
              />
            )}
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            onChange={(url: string) => {
              if (url) {
                onSubmit({ imageUrl: url })
              }
            }}
            endpoint={'courseImage'}
          />
          <div className={'mt-4 text-sm text-muted-foreground'}>16:9 aspect ratio recommended. Max image size 1MB</div>
        </div>
      )}
    </div>
  )
}

export default ImageForm
