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
import { Pencil, Loader2, PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Chapter, Course } from '@prisma/client'
import { Input } from '@/components/ui/input'
import ChaptersList from '@teacher/courses/[courseId]/_components/chapters-list'

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[] }
  courseId: Promise<string>
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Description is required',
  }),
})

function ChaptersForm({ initialData, courseId }: ChaptersFormProps) {
  const router = useRouter()
  const [isCreating, setIsCreating] = React.useState(false)
  const [isUpdating, setIsUpdating] = React.useState(false)
  const toggleCreating = () => {
    setIsCreating(current => !current)
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '' },
  })

  const { isSubmitting, isValid } = form.formState
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values)
      toast.success('Chapter updated')
      toggleCreating()
      router.refresh()
    } catch (e) {
      toast.error('Something went wrong')
    }
  }

  const onReorder = async (update: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true)
      await axios.put(`/api/courses/${courseId}/chapters/reorder`, { list: update })
      toast.success('Chapters reordered')
      setIsUpdating(false)
      router.refresh()
    } catch (e) {
      toast.error('Something went wrong')
      console.log(e.message)
    } finally {
      setIsUpdating(false)
    }
  }

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`)
  }

  return (
    <div className={'relative mt-6 rounded-md border bg-slate-100 p-2'}>
      {isUpdating && (
        <div
          className={'rounded-m absolute right-0 top-0 flex h-full w-full items-center justify-center bg-slate-500/20'}>
          <Loader2 className='h-10 w-10 animate-spin' />
        </div>
      )}
      <div className='flex items-center justify-between font-medium'>
        Course chapters
        <Button onClick={toggleCreating} variant={'ghost'}>
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className={'mr-2 h-4 w-4'} />
              Add a chapter
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={'mt-4 space-y-4'}>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className={'bg-white'}
                      disabled={isSubmitting}
                      placeholder='e.g. "Intoducing the course..."'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type='submit'>
              Create
            </Button>
          </form>
        </Form>
      )}

      {!isCreating && (
        <div className={cn('mt-2 text-sm', !initialData.chapters.length && 'italic text-slate-500')}>
          {!initialData.chapters.length && 'No chapters'}
          <ChaptersList onEdit={onEdit} onReorder={onReorder} items={initialData.chapters || []} />
        </div>
      )}

      {!isCreating && <p className={'text-sm text-muted-foreground'}>Drag and drop chapters here.</p>}
    </div>
  )
}

export default ChaptersForm
