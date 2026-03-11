interface AdminPageTitleProps {
  title: string
}

export function AdminPageTitle({ title }: AdminPageTitleProps) {
  return (
    <h1 className="text-2xl font-bold text-[var(--text)] mb-8">{title}</h1>
  )
}
