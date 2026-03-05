interface EmptyStateProps {
  title?: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({
  title = '데이터가 없습니다',
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-[var(--spacing-16)] gap-4 text-center">
      <div className="text-4xl">📭</div>
      <div>
        <p className="text-[var(--text)] font-medium mb-1">{title}</p>
        {description && (
          <p className="text-[var(--text-muted)] text-[var(--font-size-caption)]">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
