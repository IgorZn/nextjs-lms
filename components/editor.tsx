'use client'

import dynamic from 'next/dynamic'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { useMemo } from 'react'

interface EditorProps {
  onChange: (value: string) => void
  value: string
}

export const Editor = ({ onChange, value }: EditorProps) => {
  const RectQuill = useMemo(() => dynamic(() => import('react-quill-new'), { ssr: false }), [])

  return (
    <div className={'bg-white'}>
      <ReactQuill theme={'snow'} value={value} onChange={onChange} />
    </div>
  )
}
