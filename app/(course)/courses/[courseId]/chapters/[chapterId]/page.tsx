import React from 'react'

async function ChapterIdPage({ params }: { params: { chapterId: Promise<string> } }) {
  const chapterId = (await params).chapterId
  return <div>Chapter id {chapterId}</div>
}

export default ChapterIdPage
