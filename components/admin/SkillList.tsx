'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { LoadingState } from '@/components/common/LoadingState'
import { EmptyState } from '@/components/common/EmptyState'
import type { SkillsByCategory } from '@/feature/skill/type'

interface Skill {
  id: number
  name: string
  category: string
  proficiency: number
  iconUrl: string | null
  sortOrder: number
}

interface SkillListProps {
  skills: SkillsByCategory
  loading: boolean
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  onReorder: (updates: Array<{ id: number; sortOrder: number }>) => void
}

const PROFICIENCY_STARS = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)

function SortableRow({
  skill,
  onEdit,
  onDelete,
}: {
  skill: Skill
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: skill.id,
  })

  return (
    <tr
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      className="border-t border-[var(--border-color)] hover:bg-[var(--elevated)] transition-colors align-middle"
    >
      <td className="px-2 py-3 text-center">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-[var(--text-muted)] hover:text-[var(--text)] touch-none p-1 rounded"
          aria-label="드래그로 순서 변경"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm6-8a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
          </svg>
        </button>
      </td>
      <td className="px-4 py-3 text-sm text-[var(--text-muted)] hidden md:table-cell text-center">
        {skill.sortOrder}
      </td>
      <td className="px-4 py-3">
        <span className="text-sm font-medium text-[var(--text)]">{skill.name}</span>
      </td>
      <td className="px-4 py-3 text-sm text-yellow-400 hidden sm:table-cell tracking-wide text-center">
        {PROFICIENCY_STARS(skill.proficiency)}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-center">
        <div className="flex gap-2 justify-center">
          <Button variant="ghost" size="sm" onClick={() => onEdit(skill.id)}>
            수정
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(skill.id)}
            className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
          >
            삭제
          </Button>
        </div>
      </td>
    </tr>
  )
}

function CategoryTable({
  category,
  initialSkills,
  onEdit,
  onDelete,
  onReorder,
}: {
  category: string
  initialSkills: Skill[]
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  onReorder: (updates: Array<{ id: number; sortOrder: number }>) => void
}) {
  const [items, setItems] = useState<Skill[]>(initialSkills)

  // 외부 데이터(invalidateQueries 후)가 바뀌면 로컬 상태 동기화
  const ids = initialSkills.map((s) => s.id).join(',')
  const orders = initialSkills.map((s) => s.sortOrder).join(',')
  const [syncKey, setSyncKey] = useState(`${ids}:${orders}`)
  if (`${ids}:${orders}` !== syncKey) {
    setSyncKey(`${ids}:${orders}`)
    setItems(initialSkills)
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((s) => s.id === active.id)
    const newIndex = items.findIndex((s) => s.id === over.id)
    const newItems = arrayMove(items, oldIndex, newIndex)

    setItems(newItems)
    onReorder(newItems.map((s: Skill, i: number) => ({ id: s.id, sortOrder: i + 1 })))
  }

  return (
    <Card className="p-0 overflow-hidden">
      <div className="px-6 py-4">
        <h3 className="text-base font-bold text-[var(--color-brand-purple)]">{category}</h3>
      </div>
      <div className="overflow-x-auto">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <table className="w-full text-left table-fixed">
              <colgroup>
                <col style={{ width: '3%' }} />
                <col style={{ width: '10%' }} className="hidden md:table-column" />
                <col style={{ width: '47%' }} />
                <col style={{ width: '20%' }} className="hidden sm:table-column" />
                <col style={{ width: '20%' }} />
              </colgroup>
              <thead>
                <tr className="border-b border-[var(--border-color)] align-middle">
                  <th className="px-2 py-3" />
                  <th className="px-4 py-3 text-sm font-semibold text-[var(--text)] hidden md:table-cell text-center">정렬</th>
                  <th className="px-4 py-3 text-sm font-semibold text-[var(--text)]">스킬명</th>
                  <th className="px-4 py-3 text-sm font-semibold text-[var(--text)] hidden sm:table-cell text-center">숙련도</th>
                  <th className="px-4 py-3 text-sm font-semibold text-[var(--text)] text-center">관리</th>
                </tr>
              </thead>
              <tbody>
                {items.map((skill) => (
                  <SortableRow
                    key={skill.id}
                    skill={skill}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </tbody>
            </table>
          </SortableContext>
        </DndContext>
      </div>
    </Card>
  )
}

export function SkillList({ skills, loading, onEdit, onDelete, onReorder }: SkillListProps) {
  if (loading) return <LoadingState />

  const categories = Object.keys(skills)
  if (categories.length === 0) return <EmptyState title="등록된 스킬이 없습니다." />

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <CategoryTable
          key={category}
          category={category}
          initialSkills={skills[category] as Skill[]}
          onEdit={onEdit}
          onDelete={onDelete}
          onReorder={onReorder}
        />
      ))}
    </div>
  )
}
