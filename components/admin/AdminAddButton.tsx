import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'

interface AdminAddButtonProps {
  label: string
  onClick: () => void
}

export function AdminAddButton({ label, onClick }: AdminAddButtonProps) {
  return (
    <Button variant="primary" onClick={onClick} className="flex items-center gap-1.5">
      <Plus size={15} strokeWidth={2.5} />
      {label} 추가
    </Button>
  )
}
