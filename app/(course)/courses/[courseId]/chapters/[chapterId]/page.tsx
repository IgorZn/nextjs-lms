import React from 'react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getChapter } from '@/actions/get-chapter'
import Banner from '@/components/banner'
import { VideoPlayer } from '@/app/(course)/courses/[courseId]/chapters/[chapterId]/_components/video-player'

async function ChapterIdPage({ params }: { params: { chapterId: Promise<string>; courseId: Promise<string> } }) {
  const { chapterId, courseId } = { ...(await params) }
  const { userId } = await auth()

  if (!userId) {
    return redirect('/')
  }

  const { chapter, course, muxDate, attachments, nextChapter, userProgress, purchase } = await getChapter({
    chapterId,
    userId,
    courseId,
  })

  if (!chapter || !course) {
    return redirect('/')
  }

  const isLocked = !chapter.isFree && !purchase
  const onCompleteOnEnd = !!purchase & !userProgress?.isCompleted

  return (
    <div>
      {userProgress?.isCompleted && <Banner variant={'success'} label={`You have completed this chapter`} />}
      {isLocked && <Banner variant={'warning'} label={`Purchase this course to unlock this chapter`} />}
      <div className={'mx-auto flex max-w-4xl flex-col pb-20'}>
        <VideoPlayer
          chapter={chapter}
          title={course.title}
          courseid={courseId}
          nextChapter={nextChapter?.id}
          playbackId={muxDate?.playbackId}
          isLocked={isLocked}
          onCompleteOnEnd={onCompleteOnEnd}
        />
      </div>
    </div>
  )
}

export default ChapterIdPage
