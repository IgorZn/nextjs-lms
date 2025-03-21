'use client'

import React, { useTransition } from 'react'
import { Chapter } from '@prisma/client'
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from '@hello-pangea/dnd'

import { cn } from '@/lib/utils'
import { Grip, Pencil } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface ChaptersListProps {
  onEdit: (id: string) => void
  items: Chapter[]
  onReorder: (update: { id: string; position: number }[]) => void
}

function ChaptersList({ onEdit, onReorder, items }: ChaptersListProps) {
  const [isMounted, setIsMounted] = React.useState(false)
  const [chapters, setChapters] = React.useState<Chapter[]>([])

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  React.useEffect(() => {
    setChapters(items)
  }, [items])

  const onDragEnd = (result: DropResult) => {
    // console.log('result_raw', result)
    if (!result.destination) return

    const {
      destination: { index: endIndex },
      source: { index: startIndex },
    } = result

    const items = Array.from(chapters)
    const [removed] = items.splice(startIndex, 1)
    items.splice(endIndex, 0, removed)
    const updatedItems = items.map((item, index) => ({
      id: item.id,
      position: items.findIndex(i => i.id === item.id),
    }))

    // console.log(items)
    // console.log(updatedItems)

    setChapters(items)
    onReorder(updatedItems)
  }

  if (!isMounted) {
    return null
  }

  console.log('[ChaptersList]', chapters)
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={'chapters'}>
        {provided => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, index) => (
              <Draggable draggableId={chapter.id} index={index} key={chapter.id}>
                {provided => (
                  <div
                    className={cn(
                      'mb-4 flex items-center gap-x-2 rounded-md border-slate-200 bg-slate-200 text-sm text-slate-700',
                      chapter.isPublished && 'border-sky-100 bg-sky-100 text-sky-700'
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}>
                    <div
                      className={cn(
                        'hove:gb-slate-300 border-l-md border-r border-r-slate-200 px-2 py-3 transition',
                        chapter.isPublished && 'border-r-sky-200 hover:bg-sky-200'
                      )}
                      {...provided.dragHandleProps}>
                      <Grip className={'h-5 w-5'} />
                    </div>
                    {chapter.title}
                    <div className={'ml-auto flex items-center gap-x-2 pr-2'}>
                      {chapter.isFree && <Badge>Free</Badge>}
                    </div>
                    <div className={'mr-2 flex gap-x-2'}>
                      <Badge className={cn('bg-slate-500', chapter.isPublished && 'bg-sky-700')}>
                        {chapter.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                      <Pencil
                        onClick={() => onEdit(chapter.id)}
                        className={'h-4 w-4 cursor-pointer transition hover:opacity-75'}
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default ChaptersList
