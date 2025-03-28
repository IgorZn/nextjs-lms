import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'
import { auth } from '@clerk/nextjs/server'

const f = createUploadthing()

const handleAuth = async (): Promise<{ userId: string }> => {
  const { userId } = await auth()
  if (!userId) throw new UploadThingError('Unauthorized')
  return { userId }
}

export const ourFileRouter = {
  courseImage: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    .middleware(async () => handleAuth())
    .onUploadComplete(() => {}),
  courseAttachment: f(['text', 'image', 'video', 'audio', 'pdf'])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  chapterVideo: f({
    video: {
      maxFileSize: '512GB',
      maxFileCount: 1,
    },
  })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
