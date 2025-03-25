'use client'
import React from 'react'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Chapter } from '@prisma/client'
import { Preview } from '@/components/preview'
import { Checkbox } from '@/components/ui/checkbox'

interface ChapterAccessFormProps {
  initialData: Chapter
  courseId: Promise<string>
  chapterId: string
}

const formSchema = z.object({
  isFree: z.boolean().default(false),
})

function ChapterAccessForm({ initialData, courseId, chapterId }: ChapterAccessFormProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = React.useState(false)
  const toggleEdit = () => {
    setIsEditing(current => !current)
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { isFree: !!initialData?.isFree },
  })

  const { isSubmitting, isValid } = form.formState
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
        Chapter assess settings
        <Button onClick={toggleEdit} variant={'ghost'}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className={'mr-2 h-4 w-4'} />
              Edit assess
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div className={cn('mt-2 text-sm', !initialData.isFree && 'italic text-slate-500')}>
          {initialData.isFree ? 'This chapter is free' : 'This chapter is not free'}
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={'mt-4 space-y-4'}>
            <FormField
              control={form.control}
              name='isFree'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className={'space-y-1 leading-none'}>
                    <FormDescription>Check this box if you want to make this chapter free.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <div className='flex items-center gap-x-2'>
              <Button disabled={!isValid || isSubmitting} type='submit'>
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}

export default ChapterAccessForm
