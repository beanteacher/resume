import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md'
}

export function Badge({ children, variant = 'secondary', size = 'sm' }: BadgeProps) {
  const variants = {
    primary: 'bg-[var(--color-brand-purple)]/20 text-[var(--color-brand-purple)]',
    secondary: 'bg-[var(--elevated)] text-[var(--text)]',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    danger: 'bg-red-500/20 text-red-400',
  }

  const sizes = {
    sm: 'px-2.5 py-1 text-xs font-medium rounded-full',
    md: 'px-3 py-1.5 text-sm font-medium rounded-full',
  }

  return (
    <span className={`inline-block ${variants[variant]} ${sizes[size]}`}>{children}</span>
  )
}
