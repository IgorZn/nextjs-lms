'use client'

import dynamic from 'next/dynamic'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.bubble.css'
import { useMemo } from 'react'

interface PreviewProps {
  value: string
}

export const Preview = ({ value }: PreviewProps) => {
  const RectQuill = useMemo(() => dynamic(() => import('react-quill-new'), { ssr: false }), [])

  return <ReactQuill theme={'bubble'} value={value} readOnly />
}
