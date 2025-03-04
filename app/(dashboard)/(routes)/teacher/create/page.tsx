'use client'

import React from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import axios, { AxiosResponse } from 'axios'

const fromSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
})

function Page(props: object) {
  const router = useRouter()
  const form = useForm<z.infer<typeof fromSchema>>({
    resolver: zodResolver(fromSchema),
    defaultValues: {
      title: '',
    },
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: z.infer<typeof fromSchema>) => {
    try {
      const response: AxiosResponse = await axios.post('/api/courses', {
        values,
      })
      router.push(`/teacher/courses/${response.data.id}`)
    } catch (e) {
      toast.error('Something went wrong')
    }
  }

  return (
    <div className={'mx-auto flex h-full max-w-5xl items-center justify-center p-6'}>
      <div>
        <h1 className={'text-2xl'}>Name your course</h1>
        <p className={'text-sm text-slate-600'}>
          What would you like to call this course? Don&apos;t worry, you can change this later.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={'mt-6 space-y-8'}>
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course title</FormLabel>
                  <FormControl>
                    <Input disabled={isSubmitting} placeholder={'e.g. "Advanced web development"'} {...field} />
                  </FormControl>
                  <FormDescription>What will you teach in this course?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
              name={'title'}
              control={form.control}
            />
            <div className='flex items-center gap-x-2'>
              <Link href={'/teacher/courses'}>
                <Button type={'button'} variant={'ghost'}>
                  Cancel
                </Button>
              </Link>
              <Button type={'submit'} disabled={!isValid || isSubmitting}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Page
