interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = '불러오는 중...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-[var(--spacing-16)] gap-4">
      <div className="w-8 h-8 rounded-full border-2 border-[var(--border-color)] border-t-[var(--color-brand-purple)] animate-spin" />
      <p className="text-[var(--text-muted)] text-[var(--font-size-caption)]">{message}</p>
    </div>
  )
}
