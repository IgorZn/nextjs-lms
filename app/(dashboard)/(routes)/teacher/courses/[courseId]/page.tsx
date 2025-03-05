/* eslint-disable */
import React from 'react'

interface PageProps {
  params: {
    courseId: string
  }
}

function Page({ params }: PageProps) {
  return <div>Course: {params.courseId}</div>
}

export default Page
