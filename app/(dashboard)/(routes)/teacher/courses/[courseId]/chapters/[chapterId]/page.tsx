import React from 'react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import Link from 'next/link'
import { ArrowLeft, Eye, LayoutDashboard, Video } from 'lucide-react'
import { IconBadge } from '@/components/icon-badge'
import ChapterTitleForm from '@chapterId/_components/chapter-title-form'
import ChapterDescriptionForm from '@chapterId/_components/chapter-description-form'
import ChapterAccessForm from '@chapterId/_components/chapter-access-form'
import ChapterVideoForm from '@chapterId/_components/chapter-video-form'
import Banner from '@/components/banner'
import ChapterActions from '@chapterId/_components/chapter-actions'

async function Page({ params }: { params: { courseId: Promise<string>; chapterId: Promise<string> } }) {
  const userId = await auth()
  const { courseId, chapterId } = await params

  if (!userId) redirect('/')

  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
      courseId: courseId,
    },
    include: {
      muxData: true,
    },
  })

  if (!chapter) redirect('/')

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl]

  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length

  const completionText = `(${completedFields}/${totalFields})`
  const isComplete = requiredFields.every(Boolean)

  return (
    <>
      {!chapter.isPublished && <Banner label={'This chapter is not published'} variant={'warning'} />}
      <div className={'p-6'}>
        <div className={'flex items-center justify-center'}>
          <div className={'w-full'}>
            <Link
              href={`/teacher/courses/${courseId}`}
              className={'mb-6 flex items-center text-sm transition hover:opacity-75'}>
              <ArrowLeft className={'mr-2 h-4 w-4'} />
              Back to course setup
            </Link>
            <div className={'flex w-full items-center justify-center'}>
              <div className={'flex flex-col gap-y-2'}>
                <h1 className={'text-2xl font-medium'}>Chapter Creation</h1>
                <span className={'text-sm text-slate-700'}>Complete all fields {completionText}</span>
              </div>
            </div>
            <ChapterActions
              disabled={!isComplete}
              courseId={courseId}
              chapterId={chapterId}
              isPublished={chapter.isPublished}
            />
          </div>
        </div>
        {/*  */}
        <div className={'mt-16 grid grid-cols-1 gap-6 md:grid-cols-2'}>
          <div className={'space-y-4'}>
            <div>
              <div className={'flex items-center gap-x-2'}>
                <IconBadge icon={LayoutDashboard} />
                <h2 className={'text-xl'}>Customize your chapter</h2>
              </div>
              <ChapterTitleForm initialData={chapter} courseId={courseId} chapterId={chapterId} />
              <ChapterDescriptionForm initialData={chapter} courseId={courseId} chapterId={chapterId} />
            </div>
            <div className={'flex items-center gap-x-2'}>
              <IconBadge icon={Eye} />
              <h2 className={'text-xl'}>Access Settings</h2>
            </div>
            <ChapterAccessForm initialData={chapter} courseId={courseId} chapterId={chapterId} />
          </div>
          <div>
            <div className={'flex items-center gap-x-2'}>
              <IconBadge icon={Video} />
              <h2>Upload a video</h2>
            </div>
            <ChapterVideoForm initialData={chapter} courseId={courseId} chapterId={chapterId} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Page
