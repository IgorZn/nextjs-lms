'use client'

import MuxPlayer from '@mux/mux-player-react'
import { Loader2, Lock } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface VideoPlayerProps {
  chapter: string
  title: string
  courseId: string
  nextChapter: string
  playbackId: string
  isLocked: boolean
  onCompleteOnEnd: boolean
}

export function VideoPlayer({
  chapter,
  title,
  courseId,
  nextChapter,
  playbackId,
  isLocked,
  onCompleteOnEnd,
}: VideoPlayerProps) {
  const [isReady, setIsReady] = useState(false)
  return (
    <div className={'relative aspect-video'}>
      {!isLocked && (
        <div className={'absolute inset-0 flex items-center justify-center bg-slate-800'}>
          <Loader2 className={'h-8 w-8 animate-spin text-secondary'} />
        </div>
      )}
      {isLocked && (
        <div
          className={'absolute inset-0 flex flex-col items-center justify-center gap-y-2 bg-slate-800 text-secondary'}>
          <Lock className={'h-8 w-8'} />
          <span className={'text-sm'}>This chapter is locked</span>
        </div>
      )}
      {!isLocked && isReady && (
        <MuxPlayer
          title={title}
          className={cn(!isReady && 'hidden')}
          onCanPlay={() => setIsReady(true)}
          onEnded={() => {}}
          playbackId={playbackId}
          autoPlay
        />
      )}
    </div>
  )
}
