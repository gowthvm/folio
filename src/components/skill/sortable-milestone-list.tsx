'use client'

import { useState, useRef } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MilestoneInput {
  id: string
  title: string
  description: string
  weight_percent: number
  estimated_minutes: number | null
  order_index: number
}

interface SortableMilestoneListProps {
  milestones: MilestoneInput[]
  onChange: (id: string, field: keyof MilestoneInput, value: string | number | null) => void
  onRemove: (id: string) => void
  onReorder: (milestones: MilestoneInput[]) => void
}

function SortableMilestoneItem({
  milestone,
  onChange,
  onRemove,
  isFirst,
}: {
  milestone: MilestoneInput
  onChange: (id: string, field: keyof MilestoneInput, value: string | number | null) => void
  onRemove: (id: string) => void
  isFirst: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: milestone.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'p-[var(--space-3)] border border-[var(--paper-ruled)] bg-[var(--surface-card)]',
        'transition-shadow',
        isDragging && 'shadow-lg z-50 relative'
      )}
    >
      <div className="flex items-start gap-[var(--space-3)]">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-2 p-1 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-[var(--paper-tertiary)] cursor-grab active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-offset-2 focus-visible:outline-[var(--ink-secondary)]"
          aria-label="Drag to reorder milestone"
        >
          <GripVertical className="w-4 h-4 text-[var(--ink-tertiary)]" />
        </button>

        {/* Content */}
        <div className="flex-1 space-y-[var(--space-2)]">
          <input
            type="text"
            value={milestone.title}
            onChange={(e) => onChange(milestone.id, 'title', e.target.value)}
            placeholder={`Milestone ${milestone.order_index + 1}`}
            className="w-full px-[var(--space-2)] py-1 bg-transparent font-display text-[var(--text-body)] font-normal focus:outline-none focus:border-[var(--ink-secondary)] border border-transparent"
          />
          <input
            type="text"
            value={milestone.description}
            onChange={(e) => onChange(milestone.id, 'description', e.target.value)}
            placeholder="Description (optional)"
            className="w-full px-[var(--space-2)] py-1 bg-transparent font-body text-[var(--text-caption)] text-[var(--ink-tertiary)] focus:outline-none focus:border-[var(--ink-secondary)] border border-transparent"
          />
          
          <div className="flex gap-[var(--space-2)] pt-1">
            <div className="flex items-center gap-[var(--space-1)]">
              <span className="font-ui text-[10px] text-[var(--ink-tertiary)] uppercase tracking-[0.08em]">Weight %</span>
              <input
                type="number"
                value={milestone.weight_percent}
                onChange={(e) => onChange(milestone.id, 'weight_percent', parseFloat(e.target.value) || 0)}
                min={0}
                max={100}
                step="0.1"
                className="w-16 px-[var(--space-2)] py-1 font-ui text-[var(--text-caption)] border border-[var(--paper-ruled)] bg-transparent text-center focus:outline-none focus:border-[var(--ink-secondary)] rounded-none tabular-nums"
              />
            </div>
            <div className="flex items-center gap-[var(--space-1)]">
              <span className="font-ui text-[10px] text-[var(--ink-tertiary)] uppercase tracking-[0.08em]">Est. min</span>
              <input
                type="number"
                value={milestone.estimated_minutes || ''}
                onChange={(e) => onChange(milestone.id, 'estimated_minutes', e.target.value ? parseInt(e.target.value) : null)}
                placeholder="—"
                className="w-16 px-[var(--space-2)] py-1 font-ui text-[var(--text-caption)] border border-[var(--paper-ruled)] bg-transparent text-center focus:outline-none focus:border-[var(--ink-secondary)] rounded-none tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* Remove button */}
        {!isFirst && (
          <button
            onClick={() => onRemove(milestone.id)}
            className="mt-2 p-1 min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--accent-red)] hover:bg-[var(--accent-red)]/10 transition-colors focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)]"
            aria-label="Remove milestone"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export function SortableMilestoneList({
  milestones,
  onChange,
  onRemove,
  onReorder,
}: SortableMilestoneListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = milestones.findIndex(m => m.id === active.id)
      const newIndex = milestones.findIndex(m => m.id === over.id)
      
      onReorder(arrayMove(milestones, oldIndex, newIndex))
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={milestones.map(m => m.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2" role="list" aria-label="Milestones">
          {milestones.map((milestone, index) => (
            <SortableMilestoneItem
              key={milestone.id}
              milestone={milestone}
              onChange={onChange}
              onRemove={onRemove}
              isFirst={index === 0}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
