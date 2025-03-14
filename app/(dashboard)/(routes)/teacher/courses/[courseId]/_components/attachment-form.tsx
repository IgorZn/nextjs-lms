'use client'
import React, { useEffect, useState } from 'react'
import * as z from 'zod'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react'
import { Attachment, Course } from '@prisma/client'
import FileUpload from '@/components/file-upload'
import Image from 'next/image'

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] }
  courseId: string
}

const formSchema = z.object({
  url: z.string().min(1, {
    message: 'Url is required',
  }),
})

function AttachmentForm({ initialData, courseId }: AttachmentFormProps) {
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
      await axios.post(`/api/courses/${courseId}/attachments`, values)
      toast.success('File updated')
      toggleEdit()
      router.refresh()
    } catch (e) {
      toast.error('Something went wrong')
    }
  }
  return (
    <div className={'mt-6 rounded-md border bg-slate-100 p-2'}>
      <div className='flex items-center justify-between font-medium'>
        Course attachments
        <Button onClick={toggleEdit} variant={'ghost'}>
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className={'mr-2 h-4 w-4'} />
              Add an file(s)
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className={'mt-2 text-sm italic text-slate-500'}>No attachments yet</p>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            onChange={(url: string) => {
              if (url) {
                onSubmit({ url: url })
              }
            }}
            endpoint={'courseAttachment'}
          />
          <div className={'mt-4 text-sm text-muted-foreground'}>Add anything your students might need</div>
        </div>
      )}
    </div>
  )
}

export default AttachmentForm
